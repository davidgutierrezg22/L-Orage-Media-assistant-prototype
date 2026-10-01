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
  if (who === 'bot') renderMarkdown(el, text);
  else el.textContent = text;
  messages.append(el);
  messages.scrollTop = messages.scrollHeight;
  return el;
}

function appendInline(parent, text) {
  const pattern = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(\*\*(.+?)\*\*)|__(.+?)__|`([^`]+)`|\*([^*\n]+)\*|_([^_\n]+)_/g;
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) parent.append(document.createTextNode(text.slice(cursor, match.index)));
    if (match[2] && match[3]) {
      try {
        const url = new URL(match[3]);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          const link = document.createElement('a');
          link.href = url.href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          appendInline(link, match[2]);
          parent.append(link);
        } else parent.append(document.createTextNode(match[0]));
      } catch {
        parent.append(document.createTextNode(match[0]));
      }
    } else if (match[5] || match[6]) {
      const strong = document.createElement('strong');
      appendInline(strong, match[5] || match[6]);
      parent.append(strong);
    } else if (match[7]) {
      const code = document.createElement('code');
      code.textContent = match[7];
      parent.append(code);
    } else if (match[8] || match[9]) {
      const emphasis = document.createElement('em');
      appendInline(emphasis, match[8] || match[9]);
      parent.append(emphasis);
    }
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) parent.append(document.createTextNode(text.slice(cursor)));
}

function renderMarkdown(element, source) {
  const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
  element.replaceChildren();
  let index = 0;

  const isBlockStart = line => /^\s*(?:```|#{1,6}\s|[-*_]{3,}\s*$|>|[-+*]\s+|\d+\.\s+)/.test(line);

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }

    if (/^\s*```/.test(line)) {
      index++;
      const codeLines = [];
      while (index < lines.length && !/^\s*```/.test(lines[index])) codeLines.push(lines[index++]);
      if (index < lines.length) index++;
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = codeLines.join('\n');
      pre.append(code);
      element.append(pre);
      continue;
    }

    const heading = line.match(/^\s*(#{1,6})\s+(.+)$/);
    if (heading) {
      const node = document.createElement(`h${Math.min(heading[1].length + 1, 6)}`);
      appendInline(node, heading[2]);
      element.append(node);
      index++;
      continue;
    }

    if (/^\s*(?:-{3,}|_{3,}|\*{3,})\s*$/.test(line)) {
      element.append(document.createElement('hr'));
      index++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote = document.createElement('blockquote');
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        if (quote.childNodes.length) quote.append(document.createElement('br'));
        appendInline(quote, lines[index++].replace(/^\s*>\s?/, ''));
      }
      element.append(quote);
      continue;
    }

    const firstListItem = line.match(/^\s*([-+*]|\d+\.)\s+(.+)$/);
    if (firstListItem) {
      const ordered = /^\d+\.$/.test(firstListItem[1]);
      const list = document.createElement(ordered ? 'ol' : 'ul');
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-+*]|\d+\.)\s+(.+)$/);
        if (!item || /^\d+\.$/.test(item[1]) !== ordered) break;
        const li = document.createElement('li');
        appendInline(li, item[2]);
        list.append(li);
        index++;
      }
      element.append(list);
      continue;
    }

    const paragraph = document.createElement('p');
    while (index < lines.length && lines[index].trim() && !(paragraph.childNodes.length && isBlockStart(lines[index]))) {
      if (paragraph.childNodes.length) paragraph.append(document.createElement('br'));
      appendInline(paragraph, lines[index++]);
    }
    element.append(paragraph);
  }
}

async function checkService() {
  try {
    const response = await fetch('/api/health');
    const result = await response.json();
    modelStatus.textContent = result.configured ? 'Ollama local conectado' : result.connected ? 'Falta el modelo local' : 'Abre Ollama para conectar';
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
      renderMarkdown(answer, answerText);
      messages.scrollTop = messages.scrollHeight;
    }
    answerText += decoder.decode();
    if (!answerText.trim()) throw new Error('El modelo no devolvió una respuesta. Inténtalo otra vez.');
    renderMarkdown(answer, answerText);
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
