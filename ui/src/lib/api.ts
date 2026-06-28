import { getJson, postJson } from './apiConfig'

export type ChatRole = 'user' | 'assistant' | 'system'

export type ModelInfo = { name: string }
export type ModelsResponse = { models: ModelInfo[]; default_model: string }

export type SessionResponse = { session_id: string }
export type ChatResponse = { answer: string; trace_id: string; session_id: string }

export async function initChatSession(): Promise<SessionResponse> {
  return postJson<SessionResponse>('/api/v1/chat/init')
}

export async function getModels(): Promise<ModelsResponse> {
  return getJson<ModelsResponse>('/api/v1/models/')
}

export async function sendMessage(payload: {
  user_query: string
  session_id?: string
  model_name?: string
}): Promise<ChatResponse> {
  return postJson<ChatResponse>('/api/v1/chat/send_message', payload)
}
