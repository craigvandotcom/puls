

// Add to home screen prompt
let deferredPrompt

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault()
  deferredPrompt = e

  // Show install button or banner
  const installButton = document.getElementById("install-button")
  if (installButton) {
    installButton.style.display = "block"
    installButton.addEventListener("click", () => {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt")
        }
        deferredPrompt = null
      })
    })
  }
})
