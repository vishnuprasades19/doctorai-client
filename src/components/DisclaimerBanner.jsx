// Keep the safety reminder visible regardless of how long the conversation is.
function DisclaimerBanner() {
  return (
    <footer className="disclaimer-banner">
      <span className="disclaimer-icon" aria-hidden="true">i</span>
      <span>This assistant provides general information and is not a substitute for professional medical advice.</span>
    </footer>
  )
}

export default DisclaimerBanner