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
    const { pdfText, sessionId, apiKey } = await req.json()
    
    if (!apiKey) {
      throw new Error('Gemini API key not provided. Please add your API key in settings.')
    }
    
    console.log('Processing PDF text of length:', pdfText?.length)

    const prompt = `Generate 5 multiple choice questions from this text. Return ONLY a JSON array with this format:
[{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": 0,
  "explanation": "Brief explanation"
}]

Text: ${pdfText.substring(0, 4000)}`

    // Call Gemini AI
    console.log('Calling Gemini API for MCQ generation')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
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
    let questions = []
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0])
        console.log(`Successfully parsed ${questions.length} questions`)
      } else {
        console.error('No JSON array found in response')
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e)
    }

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})