const form = document.getElementById('chat-form');
const textarea = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

function addMessage(text, from = 'user') {
  const el = document.createElement('div');
  el.className = `message ${from}`;
  el.textContent = text;
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = textarea.value.trim();
  if (!msg) return;

  addMessage(msg, 'user');
  textarea.value = '';

  // show a loading indicator
  const loading = document.createElement('div');
  loading.className = 'message bot loading';
  loading.textContent = 'Thinking...';
  messagesDiv.appendChild(loading);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    loading.remove();

    if (!res.ok) {
      addMessage(data.error || 'Error from server', 'bot');
      return;
    }

    addMessage(data.reply, 'bot');
  } catch (err) {
    loading.remove();
    addMessage('Network error: ' + err.message, 'bot');
  }
});
