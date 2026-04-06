import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

export const openAiClient = new OpenAI({
  apiKey,
})

export const openAiModel = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
