import { Hono } from 'hono'
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

type Bindings = {
  GOOGLE_GENERATIVE_AI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/generate', async (c) => {
  const google = createGoogleGenerativeAI({
    apiKey: c.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
  const { text } = await generateText({
    model: google('gemini-1.5-flash'),
    system: 'You are a friendly assistant!',
    prompt: 'Why is the sky blue?',

  });
  return c.json({ text })
})

export default app
