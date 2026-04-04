export type ChatRole = 'user' | 'agent'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

export type AssistResponse = {
  message: string
  question: string
}

export type RequestStatus = 'idle' | 'submitting' | 'error'

export type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}
