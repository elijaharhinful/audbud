import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createSupabaseServerClient } from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface ExpenseData {
  amount: number
  category: string
  description: string
  date: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json({ success: false, error: 'No audio file provided' }, { status: 400 })
    }

    // Convert File to Buffer for OpenAI
    const buffer = Buffer.from(await audioFile.arrayBuffer())
    
    // Create a temporary file-like object for OpenAI
    const audioData = new File([buffer], 'audio.wav', { type: 'audio/wav' })

    // Transcribe audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioData,
      model: 'whisper-1',
    })

    const transcribedText = transcription.text

    // Parse the transcribed text to extract expense information
    const expenseData = await parseExpenseFromText(transcribedText)

    if (expenseData) {
      // Get user from session (you'll need to implement session handling)
      const supabase = await createSupabaseServerClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json({ 
          success: true, 
          transcription: transcribedText,
          error: 'User not authenticated. Transcription successful but expense not saved.'
        })
      }

      // Save expense to database
      const { data: expense, error: dbError } = await supabase
        .from('expenses')
        .insert({
          userId: user.id,
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
          date: expenseData.date,
        })
        .select()
        .single()

      if (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({ 
          success: true, 
          transcription: transcribedText,
          error: 'Transcription successful but failed to save expense.'
        })
      }

      return NextResponse.json({
        success: true,
        transcription: transcribedText,
        expense: {
          id: expense.id,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date,
          isVoiceEntry: true,
          userId: expense.user_id,
          createdAt: expense.created_at,
          updatedAt: expense.updated_at
        }
      })
    }

    return NextResponse.json({
      success: true,
      transcription: transcribedText,
      message: 'Transcription successful but no expense data could be extracted.'
    })

  } catch (error) {
    console.error('Voice transcription error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process audio' 
    }, { status: 500 })
  }
}

async function parseExpenseFromText(text: string): Promise<ExpenseData | null> {
  try {
    const prompt = `
    Parse the following text to extract expense information. Return a JSON object with these fields:
    - amount (number): The expense amount
    - category (string): One of: food, transportation, entertainment, utilities, healthcare, shopping, education, other
    - description (string): A brief description of the expense
    - date (string): ISO date string (use current date if not specified)

    Text: "${text}"

    Only return valid JSON. If no expense information can be extracted, return null.
    Examples:
    "I spent 12.50 on lunch at McDonald's" -> {"amount": 12.50, "category": "food", "description": "lunch at McDonald's", "date": "${new Date().toISOString()}"}
    "Paid 50 dollars for gas" -> {"amount": 50, "category": "transportation", "description": "gas", "date": "${new Date().toISOString()}"}
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 200
    })

    const response = completion.choices[0]?.message?.content?.trim()
    
    if (!response || response === 'null') {
      return null
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(response)
      
      // Validate required fields
      if (typeof parsed.amount === 'number' && 
          typeof parsed.category === 'string' && 
          typeof parsed.description === 'string' &&
          typeof parsed.date === 'string') {
        return parsed
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
    }

    return null
  } catch (error) {
    console.error('Error parsing expense from text:', error)
    return null
  }
}