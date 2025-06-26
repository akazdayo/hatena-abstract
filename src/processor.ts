import { Bindings, ProcessingResult } from './types'
import { fetchHatenaBookmarks } from './hatena'
import { fetchWebContent } from './content'
import { generateSummary } from './ai'
import { postToNostr } from './nostr'

export async function processBookmarks(env: Bindings): Promise<ProcessingResult[]> {
  try {
    console.log('Starting bookmark processing...')
    const bookmarks = await fetchHatenaBookmarks(env)
    const results: ProcessingResult[] = []
    
    console.log(`Found ${bookmarks?.length || 0} bookmarks`)
    
    if (!bookmarks || bookmarks.length === 0) {
      return [{ url: '', status: 'error', error: 'No bookmarks found' }]
    }
    
    for (const bookmark of bookmarks) {
      try {
        console.log(`Processing bookmark: ${bookmark.url}`)
        
        const existingBookmark = await env.DB.prepare(
          'SELECT id FROM bookmarks WHERE url = ?'
        ).bind(bookmark.url).first()
        
        if (existingBookmark) {
          console.log(`Bookmark already processed: ${bookmark.url}`)
          continue
        }
        
        await env.DB.prepare(
          'INSERT INTO bookmarks (url, title, comment, bookmarked_at, status) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          bookmark.url,
          bookmark.title,
          bookmark.comment || '',
          bookmark.timestamp,
          'pending'
        ).run()
        
        const content = await fetchWebContent(bookmark.url)
        const summary = await generateSummary(env, bookmark.url, bookmark.title, content)
        
        await postToNostr(env, summary, bookmark.url)
        
        await env.DB.prepare(
          'UPDATE bookmarks SET status = ?, processed_at = ? WHERE url = ?'
        ).bind('completed', new Date().toISOString(), bookmark.url).run()
        
        results.push({ url: bookmark.url, status: 'success' })
        console.log(`Successfully processed: ${bookmark.url}`)
      } catch (error) {
        console.error(`Error processing bookmark ${bookmark.url}:`, error)
        
        try {
          await env.DB.prepare(
            'UPDATE bookmarks SET status = ? WHERE url = ?'
          ).bind('error', bookmark.url).run()
        } catch (dbError) {
          console.error('Error updating bookmark status:', dbError)
        }
        
        results.push({ url: bookmark.url, status: 'error', error: String(error) })
      }
    }
    
    console.log(`Bookmark processing completed. Results: ${results.length}`)
    return results
  } catch (error) {
    console.error('Error in processBookmarks:', error)
    throw error
  }
}