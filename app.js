const messages = document.querySelector('#messages');
const composer = document.querySelector('#composer');
const input = document.querySelector('#message-input');
const quickReplies = document.querySelector('#quick-replies');

const state = { need: '', service: '', budget: '', timing: '', name: '', handedOff: false, turns: 0 };
function addMessage(text, who = 'bot') {
  const el = document.createElement('div');
  el.className = `message ${who}`;
  el.textContent = text;
  messages.append(el);
  messages.scrollTop = messages.scrollHeight;
}
function addHandoff(summary) {
  const el = document.createElement('div');
  el.className = 'handoff';
  const title = document.createElement('strong'); title.textContent = 'Listo para el asesor';
  const body = document.createElement('span'); body.textContent = summary;
  el.append(title, body); messages.append(el); messages.scrollTop = messages.scrollHeight;
}
function setChips(items) {
  quickReplies.replaceChildren();
  for (const item of items) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = item;
    button.addEventListener('click', () => handle(item)); quickReplies.append(button);
  }
}
function getPlanInfo(text) {
  const t = text.toLowerCase();
  if (t.includes('avanzado')) return 'IA Avanzado: configuración $650.000 COP y $420.000 COP al mes. Incluye WhatsApp, Instagram y web, CRM/kanban, seguimiento y reporte mensual.';
  if (t.includes('ia básico') || t.includes('ia basico')) return 'IA Básico: configuración $450.000 COP y $280.000 COP al mes. Incluye un canal (WhatsApp o Instagram), respuestas 24/7, entrenamiento con información del negocio y agendamiento simple.';
  if (t.includes('premium')) return 'Contenido Premium: $3.000.000 COP al mes. Incluye 16 publicaciones, 6 reels avanzados, modelo en una sesión, gestión de pauta y otros beneficios. Contrato mínimo de 3 meses.';
  if (t.includes('intermedio')) return 'Contenido Intermedio: $2.100.000 COP al mes. Incluye 12 publicaciones, 4 reels, 2 sesiones de foto/video, plan mensual y gestión de pauta. Contrato mínimo de 3 meses.';
  if (t.includes('básico') || t.includes('basico')) return 'Contenido Básico: $1.300.000 COP al mes. Incluye community management, 8 publicaciones, una sesión de fotos e informe básico. Contrato mínimo de 3 meses.';
  if (t.includes('landing')) return 'La landing page informativa cuesta $900.000 COP. Un sitio web completo empieza desde $2.000.000 COP.';
  if (t.includes('pauta') || t.includes('publicidad')) return 'La configuración inicial de pauta cuesta $400.000 COP y la gestión mensual $500.000 COP. El presupuesto de anuncios se paga aparte directamente a la plataforma.';
  return '';
}
function handle(raw) {
  const text = raw.trim(); if (!text) return;
  addMessage(text, 'user'); input.value = ''; quickReplies.replaceChildren(); state.turns++;
  if (state.need === 'contact') {
    state.name = text; state.need = ''; state.handedOff = true;
    addMessage(`Gracias, ${text}. En una versión conectada, aquí avisaríamos al asesor para que continúe contigo.`);
    addHandoff(`Resumen de demostración · Contacto: ${state.name} · Interés: ${state.service || 'por definir'} · Necesidad: ${state.needDescription || 'por conversar'} · Plazo: ${state.timing || 'por definir'}. No se ha enviado ninguna notificación.`);
    return;
  }
  const t = text.toLowerCase();
  if (state.handedOff) { addMessage('Ya dejé preparado tu caso para el asesor. Si quieres, puedes seguir agregando detalles aquí.'); return; }
  if (/\b(contratar|contrat|empezar|iniciar|agenda|agendar|reunión|reunion|asesor|propuesta|quiero|me interesa|listo para)\b/.test(t)) {
    state.service = state.service || (t.includes('avanzado') ? 'IA Avanzado' : t.includes('ia') || t.includes('automat') ? 'Sistema IA Comercial' : t.includes('redes') || t.includes('contenido') ? 'Contenido y Redes' : 'Servicio por definir');
    state.handedOff = false;
    addMessage('¡Claro! Veo que quieres avanzar. Para que el asesor pueda contactarte, ¿me compartes tu nombre y el de tu negocio?');
    state.need = 'contact'; return;
  }
  const known = getPlanInfo(text);
  if (known) {
    state.service = text; addMessage(known);
    addMessage('¿Qué te gustaría resolver principalmente con este servicio?'); state.need = 'need'; return;
  }
  if (/precio|cuánto|cuanto|tarifa|costo|vale|planes|plan/.test(t)) {
    addMessage('Manejamos Sistema IA Comercial y servicios de contenido, redes y pauta. ¿Cuál te interesa conocer?');
    setChips(['Sistema IA Comercial', 'Contenido y Redes', 'Pauta publicitaria']); return;
  }
  if (/hola|buenas|buenos días|buenas tardes/.test(t)) {
    addMessage('¡Hola! Soy el asistente de L’Orage Media. ¿Qué te interesa explorar?');
    setChips(['Automatizar WhatsApp/Instagram', 'Contenido y Redes', 'Pauta publicitaria']); return;
  }
  if (state.need === 'need') {
    state.need = ''; state.needDescription = text;
    addMessage('Entiendo. ¿Cuándo te gustaría empezar y qué canal usas más para atender clientes: WhatsApp o Instagram?');
    state.need = 'timing'; return;
  }
  if (state.need === 'timing') {
    state.timing = text; state.need = '';
    addMessage('Gracias por contarme. ¿Quieres que un asesor te contacte para revisar la mejor opción y resolver los detalles?');
    setChips(['Sí, quiero hablar con un asesor', 'Por ahora solo estoy mirando']); return;
  }
  if (/solo estoy mirando|por ahora no|más adelante|mas adelante/.test(t)) {
    addMessage('¡Claro! Puedes preguntarme por planes, precios o qué incluye cada servicio cuando quieras.'); return;
  }
  if (/whatsapp|instagram|automat|muchos mensajes|no respondo|responder/.test(t)) {
    state.service = 'Sistema IA Comercial';
    addMessage('Para automatizar la atención puedes elegir IA Básico —un canal por $280.000 COP al mes, más $450.000 de configuración— o IA Avanzado —WhatsApp, Instagram y web por $420.000 COP al mes, más $650.000 de configuración. ¿En cuántos canales recibes consultas?');
    setChips(['Solo WhatsApp', 'Solo Instagram', 'WhatsApp e Instagram']); state.need = 'need'; return;
  }
  if (/redes|contenido|reels|publicaciones|fotos/.test(t)) {
    state.service = 'Contenido y Redes';
    addMessage('Tenemos paquetes de contenido desde $1.300.000 COP al mes. El Básico incluye 8 publicaciones y una sesión de fotos; Intermedio $2.100.000 y Premium $3.000.000. Los paquetes tienen mínimo de 3 meses. ¿Qué tipo de negocio tienes y qué buscas mejorar?');
    state.need = 'need'; return;
  }
  addMessage('Puedo orientarte sobre Sistema IA Comercial, contenido y redes, pauta publicitaria o desarrollo web. ¿Qué necesita mejorar tu negocio?');
  setChips(['Sistema IA Comercial', 'Contenido y Redes', 'Pauta publicitaria']);
}

composer.addEventListener('submit', event => { event.preventDefault(); handle(input.value); });
document.querySelector('#reset').addEventListener('click', () => {
  messages.replaceChildren(); quickReplies.replaceChildren(); Object.assign(state, { need: '', service: '', budget: '', timing: '', name: '', handedOff: false, turns: 0 }); start();
});
function start() {
  addMessage('¡Hola! Soy el asistente de L’Orage Media. Puedo contarte sobre nuestros servicios, precios y ayudarte a encontrar una opción para tu negocio. ¿Qué te interesa?');
  setChips(['Automatizar WhatsApp/Instagram', 'Contenido y Redes', 'Pauta publicitaria']);
}
start();
