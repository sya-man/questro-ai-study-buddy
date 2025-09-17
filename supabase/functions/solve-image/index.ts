import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageData, language = 'English' } = await req.json()
    
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Get user's Gemini API key
    const { data: profile } = await supabase
      .from('profiles')
      .select('gemini_api_key')
      .eq('user_id', user.id)
      .single()

    if (!profile?.gemini_api_key) {
      throw new Error('Gemini API key not found. Please add your API key in settings.')
    }

    const prompt = `Analyze this image and solve all mathematical questions, physics problems, chemistry equations, or any academic questions you can identify. 
    
    Provide step-by-step solutions in ${language}. Format your response as JSON:
    [{
      "question": "The question or problem identified",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "final_answer": "The final answer",
      "explanation": "Brief explanation of the solution method"
    }]
    
    If you cannot identify any solvable questions, return an empty array.`

    // Call Gemini AI Vision
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${profile.gemini_api_key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
              }
            }
          ]
        }]
      })
    })

    const aiData = await response.json()
    const aiResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text || ''

    // Extract JSON from response
    let solutions = []
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        solutions = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e)
      // Fallback: create a single solution from the raw response
      solutions = [{
        question: "Image Analysis",
        steps: [aiResponse],
        final_answer: "See analysis above",
        explanation: "AI analysis of the uploaded image"
      }]
    }

    return new Response(JSON.stringify({ solutions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})