import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

export default function useTextarea({
  initialText,
  text: externalText,
  setText: externalSetText,
}: {
  initialText?: string
  text?: string
  setText?: Dispatch<SetStateAction<string>>
}) {
  const [interalText, internalSetText] = useState(initialText ?? '')
  const text = externalText ?? interalText
  const setText = externalSetText ?? internalSetText
  useEffect(() => {
    setText(initialText ?? '')
  }, [initialText])
  const [currentSelectionStart, setCurrentSelectionStart] = useState(0)
  const [currentSelectionEnd, setCurrentSelectionEnd] = useState(0)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (insertText: string) => {
    const newText =
      text.substring(0, currentSelectionStart) +
      insertText +
      text.substring(currentSelectionEnd, text.length)
    if (textAreaRef.current) {
      textAreaRef.current.focus()
      textAreaRef.current.value = newText
      textAreaRef.current.setSelectionRange(
        currentSelectionStart + 1,
        currentSelectionStart + 1
      )
    }
    setText(newText)
  }
  return {
    textAreaRef,
    text,
    setText,
    insertText,
    currentSelectionStart,
    setCurrentSelectionStart,
    currentSelectionEnd,
    setCurrentSelectionEnd,
  }
}
