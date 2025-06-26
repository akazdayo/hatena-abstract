export type Bindings = {
  GOOGLE_GENERATIVE_AI_API_KEY: string
  HATENA_CONSUMER_KEY: string
  HATENA_CONSUMER_SECRET: string
  HATENA_ACCESS_TOKEN: string
  HATENA_ACCESS_TOKEN_SECRET: string
  NOSTR_PRIVATE_KEY: string
  DB: any
}

export interface HatenaBookmark {
  url: string
  title: string
  comment?: string
  timestamp: string
}

export interface ProcessingResult {
  url: string
  status: 'success' | 'error'
  error?: string
}

export interface NostrEvent {
  kind: number
  created_at: number
  tags: string[][]
  content: string
  pubkey: string
  id?: string
  sig?: string
}