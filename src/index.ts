import { Hono } from 'hono'
import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Bindings } from './types'
import { fetchHatenaBookmarks } from './hatena'
import { processBookmarks } from './processor'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('Hatena Abstract API is running!')
})

app.get('/generate', async (c) => {
  const google = createGoogleGenerativeAI({
    apiKey: c.env.GOOGLE_GENERATIVE_AI_API_KEY,
  })
  const { text } = await generateText({
    model: google('gemini-2.5-flash'),
    system: 'You are a friendly assistant!',
    prompt: 'Why is the sky blue?',
  })
  return c.json({ text })
})

app.get('/hatena-bookmarks', async (c) => {
  try {
    const bookmarks = await fetchHatenaBookmarks(c.env)
    return c.json({ bookmarks })
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return c.json({ error: 'Failed to fetch bookmarks' }, 500)
  }
})

app.post('/process-bookmarks', async (c) => {
  try {
    const results = await processBookmarks(c.env)
    return c.json({ results })
  } catch (error) {
    console.error('Error processing bookmarks:', error)
    return c.json({ error: 'Failed to process bookmarks' }, 500)
  }
})

app.get('/scheduled', async (c) => {
  try {
    const results = await processBookmarks(c.env)
    return c.json({ 
      message: 'Scheduled processing completed',
      results 
    })
  } catch (error) {
    console.error('Scheduled processing error:', error)
    return c.json({ error: 'Scheduled processing failed' }, 500)
  }
})

export default {
  fetch: app.fetch,
  scheduled: async (event: any, env: Bindings, ctx: any) => {
    ctx.waitUntil(processBookmarks(env))
  }
}