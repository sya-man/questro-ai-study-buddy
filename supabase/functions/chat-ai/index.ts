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
    const { message, sessionId } = await req.json()
    
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

    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: user.id,
      role: 'user',
      content: message
    })

    // Call Gemini AI
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${profile.gemini_api_key}`, {
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

    // Save AI response
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      user_id: user.id,
      role: 'assistant',
      content: aiResponse
    })

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