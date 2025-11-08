document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message');

    // Function to add a message to the chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);

        // Clear input
        messageInput.value = '';

        try {
            // Send request to server
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: message,
                    numberOfQuestions: 5
                })
            });

            const data = await response.json();

            if (data.success) {
                // Display the quiz
                addMessage(data.quiz);
            } else {
                addMessage('Sorry, I could not generate a quiz at this time. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('An error occurred. Please try again later.');
        }
    });
});
