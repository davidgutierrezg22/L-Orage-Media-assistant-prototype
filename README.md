# Asesora comercial de L’Orage Media

Aplicación local con una interfaz de chat para vender los planes de Contenido y Redes y el Sistema IA Comercial de L’Orage Media. La conversación de negocios ayuda a descubrir la necesidad, recomendar un plan o combo y guiar al prospecto hacia el contacto con un asesor.

## Ejecutar en tu computadora

Requisitos: Node.js 22 o superior, pnpm y Ollama instalado y abierto.

1. Asegúrate de tener el modelo local: `ollama run qwen2.5-coder:7b`. Si aparece el chat de Ollama, escribe `/bye` para volver a PowerShell; Ollama seguirá disponible en segundo plano.
2. Instala las dependencias con `pnpm install`.
3. Inicia la aplicación con `pnpm dev`.
4. Abre `http://localhost:3000`.

La app se conecta al modelo local a través de Ollama en `http://127.0.0.1:11434`. Puedes cambiar `OLLAMA_BASE_URL` y `OLLAMA_MODEL` en `.env`; no se necesita una clave de AI Gateway para esta configuración.

## Alcance del asistente

- Su objetivo principal es vender los dos productos aprobados: Contenido y Redes y Sistema IA Comercial, solos o en combo.
- Descubre las necesidades del negocio y recomienda según la matriz comercial del modelo: presencia digital, demora al responder leads, volumen de consultas o necesidad de crecer con una combinación de servicios.
- Contesta dudas de negocios de forma breve como parte de la venta y luego vuelve a la recomendación del plan cuando sea pertinente.
- Usa precios, prestaciones, descuentos de combo y plazos tal como aparecen en el tarifario. No inventa precios ni condiciones ni garantiza resultados.
- Cuando el prospecto confirma que quiere contratar, muestra un enlace preparado de WhatsApp a Camilo Esquiaqui. El cliente debe enviarlo; la app no hace transferencia automática.
- No atribuye a L’Orage herramientas que no estén en el tarifario y acepta saludos y agradecimientos naturales.
- Rechaza con amabilidad preguntas ajenas a los negocios.
- No tiene herramientas de navegación ni puede enviar mensajes, crear citas, ejecutar código o hacer acciones externas.
- No ofrece asesoría legal, tributaria o financiera personalizada.

## Límites técnicos de esta versión

- La conversación se ejecuta en el navegador local y no se guarda en una base de datos.
- El servidor limita el historial, el tamaño de los mensajes y la frecuencia de solicitudes.
- La app ofrece formato Markdown seguro para respuestas del asistente (negritas, cursivas, listas, títulos, código y enlaces).
- Cuando detecta una intención clara de contratación, muestra un enlace de WhatsApp con un mensaje preparado para Camilo Esquiaqui. El cliente revisa y envía el mensaje; la app no lo envía ni integra WhatsApp Business, Instagram o un CRM.
- GitHub Pages sirve archivos estáticos y no ejecuta este backend. Esta configuración de Ollama está pensada para uso local; una versión pública necesitaría un modelo alojado en un servidor accesible desde Internet.
