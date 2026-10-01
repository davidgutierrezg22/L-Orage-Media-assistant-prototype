const messages = document.querySelector('#messages');
const composer = document.querySelector('#composer');
const input = document.querySelector('#message-input');
const sendButton = document.querySelector('#send-button');
const modelStatus = document.querySelector('#model-status');

const greeting = '¡Hola! Soy el asistente de negocios de L’Orage Media. Puedes preguntarme con tus propias palabras sobre emprendimiento, ventas, marketing, administración o nuestros servicios.';
let conversation = [{ role: 'assistant', content: greeting }];
let sending = false;

function addMessage(text, who = 'bot') {
  const el = document.createElement('div');
  el.className = `message ${who}`;
  el.textContent = text;
  messages.append(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}

async function checkService() {
  try {
    const response = await fetch('/api/health');
    const result = await response.json();
    modelStatus.textContent = result.configured ? 'Modelo conectado' : 'Falta configurar la clave del modelo';
    modelStatus.parentElement.querySelector('i').classList.toggle('offline', !result.configured);
  } catch {
    modelStatus.textContent = 'Abre la app con pnpm dev';
    modelStatus.parentElement.querySelector('i').classList.add('offline');
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || sending) return;

  addMessage(text, 'user');
  conversation.push({ role: 'user', content: text });
  input.value = '';
  sending = true;
  sendButton.disabled = true;
  input.disabled = true;
  const answer = addMessage('Pensando…');
  let answerText = '';

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversation.slice(-12) }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'No pude responder en este momento. Inténtalo de nuevo.');
    }

    answer.textContent = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      answerText += decoder.decode(value, { stream: true });
      answer.textContent = answerText;
      messages.scrollTop = messages.scrollHeight;
    }
    answerText += decoder.decode();
    if (!answerText.trim()) throw new Error('El modelo no devolvió una respuesta. Inténtalo otra vez.');
    conversation.push({ role: 'assistant', content: answerText });
  } catch (error) {
    answer.classList.add('error');
    answer.textContent = error.message;
    conversation.pop();
  } finally {
    sending = false;
    sendButton.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

composer.addEventListener('submit', handleSubmit);
document.querySelector('#reset').addEventListener('click', () => {
  if (sending) return;
  conversation = [{ role: 'assistant', content: greeting }];
  messages.replaceChildren();
  addMessage(greeting);
  input.focus();
});

addMessage(greeting);
checkService();
