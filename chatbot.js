document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-nav-btn');
    const chatbotOverlay = document.getElementById('chatbot-overlay');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatNotification = document.getElementById('chat-notification');
    
    let isChatOpen = false;
    let hasNewMessage = false;
    let chatContext = [];
    
    // Initialize with welcome message
    addMessage("Hello! I'm your math tutor. Ask me anything about math concepts or problems from your practice test.", 'bot');
    
    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', openChatbot);
    chatbotOverlay.addEventListener('click', closeChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    
    function openChatbot() {
        isChatOpen = true;
        chatbotOverlay.classList.remove('hidden');
        chatbotContainer.classList.remove('translate-y-full');
        chatNotification.classList.add('hidden');
        hasNewMessage = false;
    }
    
    function closeChatbot() {
        isChatOpen = false;
        chatbotOverlay.classList.add('hidden');
        chatbotContainer.classList.add('translate-y-full');
    }
    
    // Send message
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatContext.push({role: "user", content: message});
            chatbotInput.value = '';
            
            // Show typing indicator
            const typingIndicator = addTypingIndicator();
            
            try {
                // Get AI response
                const response = await API_SERVICE.chatWithTutor(message, chatContext);
                
                // Add to context and display
                chatContext.push({role: "assistant", content: response});
                addMessage(response, 'bot');
                
                // Show notification if chat is closed
                if (!isChatOpen && !hasNewMessage) {
                    chatNotification.classList.remove('hidden');
                    hasNewMessage = true;
                }
            } catch (error) {
                console.error("Chat error:", error);
                addMessage("I'm having temporary technical difficulties. Please try your question again.", 'bot');
            } finally {
                typingIndicator.remove();
            }
        }
    }
    
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `max-w-xs md:max-w-md p-3 rounded-lg ${sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`;
        
        // Handle line breaks in the response
        const lines = text.split('\n');
        lines.forEach((line, i) => {
            if (i > 0) contentDiv.appendChild(document.createElement('br'));
            contentDiv.appendChild(document.createTextNode(line));
        });
        
        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'flex justify-start mb-3';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none inline-flex space-x-1';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'w-2 h-2 bg-gray-400 rounded-full animate-bounce';
            dot.style.animationDelay = `${i * 0.2}s`;
            contentDiv.appendChild(dot);
        }
        
        typingDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        return typingDiv;
    }
});