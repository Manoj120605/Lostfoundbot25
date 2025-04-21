document.addEventListener("DOMContentLoaded", () => {
  // Theme toggling
  const themeToggle = document.getElementById("theme-toggle")
  const moonIcon = document.querySelector(".moon-icon")
  const sunIcon = document.querySelector(".sun-icon")

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    moonIcon.classList.toggle("hidden")
    sunIcon.classList.toggle("hidden")
  })

  // Tab switching
  const navItems = document.querySelectorAll(".nav-item")
  const tabContents = document.querySelectorAll(".tab-content")
  const pageTitle = document.getElementById("page-title")
  const reportItemBtn = document.getElementById("report-item-btn")

  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")

      // Update active nav item
      navItems.forEach((nav) => nav.classList.remove("active"))
      this.classList.add("active")

      // Show corresponding tab content
      tabContents.forEach((tab) => tab.classList.remove("active"))
      document.getElementById(`${tabId}-tab`).classList.add("active")

      // Update page title
      switch (tabId) {
        case "chat":
          pageTitle.textContent = "LostFound Assistant"
          reportItemBtn.classList.add("hidden")
          break
        case "lost-items":
          pageTitle.textContent = "Lost Items"
          reportItemBtn.classList.remove("hidden")
          break
        case "found-items":
          pageTitle.textContent = "Found Items"
          reportItemBtn.classList.remove("hidden")
          break
        case "search":
          pageTitle.textContent = "Search Items"
          reportItemBtn.classList.add("hidden")
          break
      }
    })
  })

  // Chat functionality
  const chatInput = document.getElementById("chat-input")
  const sendButton = document.getElementById("send-message")
  const chatMessages = document.querySelector(".chat-messages")

  function enableSendButton() {
    sendButton.disabled = chatInput.value.trim() === ""
  }

  chatInput.addEventListener("input", enableSendButton)

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!sendButton.disabled) {
        sendMessage()
      }
    }
  })

  sendButton.addEventListener("click", sendMessage)

  function sendMessage() {
    const message = chatInput.value.trim()
    if (!message) return

    // Add user message
    addMessage("user", message)
    chatInput.value = ""
    enableSendButton()

    // Simulate AI response
    setTimeout(() => {
      let responseContent = ""

      if (message.toLowerCase().includes("lost") || message.toLowerCase().includes("missing")) {
        responseContent =
          "I'm sorry to hear you've lost something. You can report a lost item by clicking on 'Lost Items' in the sidebar, or I can help you report it here. What kind of item did you lose?"
      } else if (message.toLowerCase().includes("found")) {
        responseContent =
          "Thank you for finding an item! You can report a found item by clicking on 'Found Items' in the sidebar, or I can help you report it here. What kind of item did you find?"
      } else if (message.toLowerCase().includes("search") || message.toLowerCase().includes("looking")) {
        responseContent =
          "You can search for items by clicking on 'Search Items' in the sidebar. You can filter by category, location, and date range to find what you're looking for."
      } else {
        responseContent =
          "I'm here to help with lost and found items. You can report lost items, report found items, or search for existing reports. How can I assist you today?"
      }

      addMessage("assistant", responseContent)
    }, 1000)
  }

  function addMessage(role, content) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${role}`

    const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (role === "assistant") {
      messageDiv.innerHTML = `
        <div class="avatar">AI</div>
        <div class="message-content">
          <div class="message-header">
            <span class="sender">LostFound AI</span>
            <span class="timestamp">${currentTime}</span>
          </div>
          <div class="message-bubble">
            <p>${formatMessage(content)}</p>
          </div>
        </div>
      `
    } else {
      messageDiv.innerHTML = `
        <div class="message-content">
          <div class="message-header">
            <span class="sender">You</span>
            <span class="timestamp">${currentTime}</span>
          </div>
          <div class="message-bubble">
            <p>${formatMessage(content)}</p>
          </div>
        </div>
      `
    }

    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function formatMessage(message) {
    // Convert line breaks to <br>
    return message.replace(/\n/g, "<br>")
  }

  // Modal functionality
  const reportItemButton = document.getElementById("report-item-btn")
  const lostItemModal = document.getElementById("report-lost-modal")
  const foundItemModal = document.getElementById("report-found-modal")
  const closeModalButtons = document.querySelectorAll(".close-modal")

  reportItemButton.addEventListener("click", () => {
    const activeTab = document.querySelector(".nav-item.active").getAttribute("data-tab")

    if (activeTab === "lost-items") {
      lostItemModal.classList.add("active")
    } else if (activeTab === "found-items") {
      foundItemModal.classList.add("active")
    }
  })

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      lostItemModal.classList.remove("active")
      foundItemModal.classList.remove("active")
    })
  })

  // Search tab functionality
  const searchTabButtons = document.querySelectorAll(".search-tab-btn")

  searchTabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      searchTabButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Category selection in modals
  const categoryItems = document.querySelectorAll(".category-item")

  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const parent = this.closest(".step-content")
      parent.querySelectorAll(".category-item").forEach((cat) => cat.classList.remove("active"))
      this.classList.add("active")
    })
  })
})
