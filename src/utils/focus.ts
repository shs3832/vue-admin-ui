import type { Ref } from 'vue'
type ErrorField = {
  error?: string
  ref: Ref<HTMLElement | null>
}

export const focusFirstErrorField = (errorFields: ErrorField[]) => {
  errorFields.find((field) => field.error)?.ref.value?.focus()
}
