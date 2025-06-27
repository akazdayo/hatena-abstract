import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Bindings } from './types'

export async function generateSummary(env: Bindings, url: string, title: string, content: string): Promise<string> {
  try {
    console.log(`Generating summary for: ${title}`)
    
    const google = createGoogleGenerativeAI({
      apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
    })
    
    const prompt = `以下のWebページの内容を要約してください。
- 重要なポイントを3つ以内でまとめる
- 280文字以内で簡潔に
- 読みやすい日本語で
- ハッシュタグを1-2個含める

URL: ${url}
タイトル: ${title}
内容: ${content}`
    
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      system: 'あなたは優秀な要約アシスタントです。与えられたWebページの内容を280文字以内で要約してください。',
      prompt,
    })
    
    console.log(`Summary generated: ${text}`)
    return text
  } catch (error) {
    console.error('Error generating summary:', error)
    throw error
  }
}