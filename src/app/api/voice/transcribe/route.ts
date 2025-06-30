// src/app/api/voice/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const userId = formData.get('userId') as string

    if (!audioFile || !userId) {
      return NextResponse.json(
        { error: 'Audio file and user ID are required' },
        { status: 400 }
      )
    }

    // 1. Transcribe audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      response_format: 'text',
    })

    // 2. Extract expense information using GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a financial assistant that extracts expense information from text. 
          Extract the following information and return it as JSON:
          - amount: number (just the number, no currency symbols)
          - description: string (what was purchased)
          - category: string (one of: food, transportation, entertainment, shopping, healthcare, utilities, housing, other)
          
          If you cannot determine the amount, set it to 0.
          If the text doesn't seem to be about an expense, return an error message.
          
          Example input: "I spent $15 on lunch at McDonald's"
          Example output: {"amount": 15, "description": "lunch at McDonald's", "category": "food"}`,
        },
        {
          role: 'user',
          content: transcription,
        },
      ],
      temperature: 0.1,
    })

    let expenseData
    try {
      expenseData = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to parse expense information from transcription' },
        { status: 400 }
      )
    }

    // Validate extracted data
    if (!expenseData.amount || expenseData.amount <= 0) {
      return NextResponse.json(
        { 
          error: 'Could not extract a valid expense amount from the recording',
          transcription 
        },
        { status: 400 }
      )
    }

    // 3. Find matching budget category
    const budget = await prisma.budget.findFirst({
      where: {
        userId,
        category: expenseData.category,
      },
    })

    // 4. Create expense record
    const expense = await prisma.expense.create({
      data: {
        userId,
        budgetId: budget?.id,
        amount: expenseData.amount,
        description: expenseData.description,
        category: expenseData.category,
        transcription,
      },
    })

    return NextResponse.json({
      ...expense,
      transcription,
      extractedData: expenseData,
    })

  } catch (error) {
    console.error('Voice processing error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}