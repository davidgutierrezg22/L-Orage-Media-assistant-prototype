# Asistente de negocios de L’Orage Media

Aplicación local con una interfaz de chat y respuestas generadas por un modelo de lenguaje. El asistente puede conversar de forma abierta sobre negocios y orientar sobre los servicios de L’Orage Media.

## Ejecutar en tu computadora

Requisitos: Node.js 22 o superior y pnpm.

1. Instala las dependencias con `pnpm install`.
2. Copia `.env.example` a `.env` y pega en ese archivo tu clave de Vercel AI Gateway.
3. Inicia la aplicación con `pnpm dev`.
4. Abre `http://localhost:3000`.

La clave `AI_GATEWAY_API_KEY` se utiliza solo en el servidor. No la pegues en `app.js`, `index.html` ni en mensajes de GitHub. El uso del modelo puede tener costos según la cuenta y el proveedor configurados en AI Gateway.

## Alcance del asistente

- Responde libremente preguntas educativas sobre emprendimiento, administración, modelos de negocio, marketing, ventas, atención al cliente, operaciones y finanzas de empresa.
- Responde en español por defecto, con ejemplos y pasos cuando sean útiles.
- Puede explicar la información aprobada de los tarifarios de L’Orage Media. No inventa precios ni condiciones si no están en esa información.
- Rechaza con amabilidad preguntas ajenas a los negocios.
- No tiene herramientas de navegación ni puede enviar mensajes, crear citas, ejecutar código o hacer acciones externas.
- No ofrece asesoría legal, tributaria o financiera personalizada.

## Límites técnicos de esta versión

- La conversación se ejecuta en el navegador local y no se guarda en una base de datos.
- El servidor limita el historial, el tamaño de los mensajes y la frecuencia de solicitudes.
- La interfaz no se conecta con WhatsApp, Instagram ni con un CRM; tampoco transfiere leads a una persona.
- GitHub Pages sirve archivos estáticos y no ejecuta este backend. Para compartir la app funcionando por Internet, hay que desplegar también `server.mjs` en un servicio compatible y guardar la clave como variable de entorno privada.
