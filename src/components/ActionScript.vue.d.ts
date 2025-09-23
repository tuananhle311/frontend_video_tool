import { DefineComponent } from 'vue'

declare const ActionScript: DefineComponent<{
  scriptContent: string
  index: number
  apiKey: string
  voiceId: string
  geminiApiKey?: string
  geminiUsage?: object
}, {}, {}, {}, {}, {}, {}, {
  'split-script': (index: number) => void
  'update-gemini-usage': (usage: { inputTokens: number; outputTokens: number; requests: number }) => void
}>

export default ActionScript