/* eslint-disable react/prop-types */
import { useState } from 'react'

// Own the draft input so it can clear immediately after a message is sent.
function ChatInput({ onSend, disabled }) {
  const [draft, setDraft] = useState('')

  function submitMessage() {
    const trimmedDraft = draft.trim()
    if (!trimmedDraft || disabled) return

    onSend(trimmedDraft)
    setDraft('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submitMessage()
    }
  }

  return (
    <div className="chat-input-area">
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe how you are feeling..."
        aria-label="Message the AI Health Assistant"
        rows="1"
        disabled={disabled}
      />
      <button type="button" onClick={submitMessage} disabled={disabled || !draft.trim()}>
        Send <span aria-hidden="true">↑</span>
      </button>
      <p className="input-hint">Press Enter to send · Shift + Enter for a new line</p>
    </div>
  )
}

export default ChatInput