export async function fetchWebContent(url: string): Promise<string> {
  try {
    console.log(`Fetching content from: ${url}`)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Hatena-Abstract-Bot/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    const truncatedContent = textContent.substring(0, 10000)
    console.log(`Content extracted: ${truncatedContent.length} characters`)
    
    return truncatedContent
  } catch (error) {
    console.error(`Failed to fetch content from ${url}:`, error)
    throw new Error(`Failed to fetch content: ${String(error)}`)
  }
}