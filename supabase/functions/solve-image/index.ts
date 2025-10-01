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
    const { imageData, language = 'English', apiKey } = await req.json()
    
    if (!apiKey) {
      throw new Error('Gemini API key not provided. Please add your API key in settings.')
    }
    
    console.log('Processing image analysis request in:', language)

    const prompt = `Analyze this image and solve all mathematical questions, physics problems, chemistry equations, or any academic questions you can identify. 
    
    Provide step-by-step solutions in ${language}. Format your response as JSON:
    [{
      "question": "The question or problem identified",
      "steps": ["Step 1", "Step 2", "Step 3"],
      "final_answer": "The final answer",
      "explanation": "Brief explanation of the solution method"
    }]
    
    If you cannot identify any solvable questions, return an empty array.`

    // Call Gemini AI Vision (using gemini-1.5-flash which supports vision)
    console.log('Calling Gemini API for image analysis')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const aiData = await response.json()
    console.log('Gemini API response received')
    const aiResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    
    if (!aiResponse) {
      throw new Error('Empty response from Gemini API')
    }

    // Extract JSON from response
    let solutions = []
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        solutions = JSON.parse(jsonMatch[0])
        console.log(`Successfully parsed ${solutions.length} solutions`)
      } else {
        console.error('No JSON array found in response')
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
    console.error('Error in solve-image function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})