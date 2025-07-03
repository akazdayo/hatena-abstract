import { Bindings, HatenaBookmark } from './types'

export async function fetchHatenaBookmarks(env: Bindings): Promise<HatenaBookmark[]> {
  const baseUrl = 'https://bookmark.hatenaapis.com/rest/1/my/bookmark'
  
  try {
    const oauthHeader = generateOAuthHeader({
      method: 'GET',
      url: baseUrl,
      consumerKey: env.HATENA_CONSUMER_KEY,
      consumerSecret: env.HATENA_CONSUMER_SECRET,
      accessToken: env.HATENA_ACCESS_TOKEN,
      accessTokenSecret: env.HATENA_ACCESS_TOKEN_SECRET
    })

    const response = await fetch(baseUrl, {
      headers: {
        'Authorization': oauthHeader
      }
    })

    if (!response.ok) {
      throw new Error(`Hatena API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Hatena bookmarks:', error)
    throw error
  }
}

function generateOAuthHeader(params: {
  method: string
  url: string
  consumerKey: string
  consumerSecret: string
  accessToken: string
  accessTokenSecret: string
}): string {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = Math.random().toString(36).substring(2, 15)
  
  const oauthParams = {
    oauth_consumer_key: params.consumerKey,
    oauth_token: params.accessToken,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: '1.0'
  }

  const paramString = Object.entries(oauthParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .sort()
    .join('&')

  const baseString = `${params.method.toUpperCase()}&${encodeURIComponent(params.url)}&${encodeURIComponent(paramString)}`
  const signingKey = `${encodeURIComponent(params.consumerSecret)}&${encodeURIComponent(params.accessTokenSecret)}`
  
  return 'OAuth ' + Object.entries(oauthParams)
    .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
    .join(', ')
}