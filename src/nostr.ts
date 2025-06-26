import { Bindings, NostrEvent } from './types'

export async function postToNostr(env: Bindings, content: string, url: string): Promise<void> {
  try {
    console.log(`Posting to Nostr: ${content}`)
    
    const privateKey = env.NOSTR_PRIVATE_KEY
    const publicKey = await getPublicKey(privateKey)
    
    const event: NostrEvent = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: `${content}\n\n${url}`,
      pubkey: publicKey
    }
    
    const eventId = await getEventId(event)
    const signature = await signEvent(event, privateKey)
    
    const signedEvent = {
      ...event,
      id: eventId,
      sig: signature
    }
    
    const relayUrls = ['wss://yabu.me']
    
    for (const relayUrl of relayUrls) {
      try {
        await sendToRelay(relayUrl, signedEvent)
        console.log(`Successfully sent to relay: ${relayUrl}`)
      } catch (error) {
        console.error(`Failed to send to relay ${relayUrl}:`, error)
      }
    }
  } catch (error) {
    console.error('Error posting to Nostr:', error)
    throw error
  }
}

async function getPublicKey(privateKeyHex: string): Promise<string> {
  return privateKeyHex.substring(64)
}

async function getEventId(event: NostrEvent): Promise<string> {
  const eventData = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ])
  
  return ''
}

async function signEvent(event: NostrEvent, privateKeyHex: string): Promise<string> {
  return ''
}

async function sendToRelay(relayUrl: string, event: any): Promise<void> {
  console.log('Sending to relay:', relayUrl, event)
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}