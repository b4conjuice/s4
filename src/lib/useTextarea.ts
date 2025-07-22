import { useEffect, useRef, useState } from 'react'

export default function useTextarea({ initialText }: { initialText?: string }) {
  const [text, setText] = useState(initialText ?? '')
  useEffect(() => {
    setText(initialText ?? '')
  }, [initialText])
  const [currentSelectionStart, setCurrentSelectionStart] = useState(0)
  const [currentSelectionEnd, setCurrentSelectionEnd] = useState(0)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  return {
    textAreaRef,
    text,
    setText,
    currentSelectionStart,
    setCurrentSelectionStart,
    currentSelectionEnd,
    setCurrentSelectionEnd,
  }
}
