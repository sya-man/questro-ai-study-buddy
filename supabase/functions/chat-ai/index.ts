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
    const { message, sessionId, apiKey } = await req.json()
    
    if (!apiKey) {
      throw new Error('Gemini API key not provided. Please add your API key in settings.')
    }

    // Call Gemini AI
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Questro, an AI learning assistant. You can help with questions in any language, explain concepts, and solve problems. Always be helpful and educational. User message: ${message}`
          }]
        }]
      })
    })

    const aiData = await response.json()
    const aiResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.'

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})