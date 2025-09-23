import { DefineComponent } from 'vue'

declare const PromptItem: DefineComponent<{
  promptText: string
  index: number
  isGeneratingImage?: boolean
  generatedImage?: object | null
}, {}, {}, {}, {}, {}, {}, {
  'update-prompt': (index: number, text: string) => void
  'copy-prompt': (text: string) => void
  'generate-image': (index: number, prompt: string) => void
  'download-image': (index: number) => void
}>

export default PromptItem