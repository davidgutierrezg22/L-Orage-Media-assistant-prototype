# Asesora comercial de L’Orage Media

Aplicación local con una interfaz de chat para vender los planes de Contenido y Redes y el Sistema IA Comercial de L’Orage Media. La conversación de negocios ayuda a descubrir la necesidad, recomendar un plan o combo y guiar al prospecto hacia el contacto con un asesor.

## Créditos

Proyecto de David Gutiérrez, desarrollado con apoyo de OpenAI Codex para la implementación y documentación.

## Ejecutar en tu computadora

Requisitos: Node.js 22 o superior, pnpm y Ollama instalado y abierto.

1. Asegúrate de tener el modelo local: `ollama run qwen2.5-coder:7b`. Si aparece el chat de Ollama, escribe `/bye` para volver a PowerShell; Ollama seguirá disponible en segundo plano.
2. Instala las dependencias con `pnpm install`.
3. Inicia la aplicación con `pnpm dev`.
4. Abre `http://localhost:3000`.

La app se conecta al modelo local a través de Ollama en `http://127.0.0.1:11434`. Puedes cambiar `OLLAMA_BASE_URL` y `OLLAMA_MODEL` en `.env`; no se necesita una clave de AI Gateway para esta configuración.

## Publicar como servicio web en Render

Render no puede conectarse al Ollama que corre en tu computador. Para que el chat funcione publicado, el proyecto usa Vercel AI Gateway en Render y Ollama localmente en tu computador.

### Configurar el servicio

En Render, crea un **New Web Service** y conecta el repositorio `davidgutierrezg22/L-Orage-Media-assistant-prototype`. En el formulario usa estos valores:

| Campo de Render | Valor |
| --- | --- |
| Name | `L-Orage-Media-assistant-prototype` o el nombre que prefieras |
| Language | `Node` |
| Branch | `main` |
| Root Directory | Dejar vacío |
| Build Command | `pnpm install --frozen-lockfile` |
| Start Command | `pnpm start` |
| Health Check Path | `/api/health` |

En **Advanced → Environment Variables**, añade estas variables antes de crear el servicio:

| Key | Value |
| --- | --- |
| `HOST` | `0.0.0.0` |
| `AI_PROVIDER` | `gateway` |
| `AI_GATEWAY_API_KEY` | Tu clave privada de Vercel AI Gateway; introdúcela directamente en Render |
| `AI_GATEWAY_MODEL` | `google/gemini-3.5-flash-lite` |

No guardes la clave en GitHub ni en `.env.example`. El archivo `.env` local está excluido de Git. En Render, `AI_GATEWAY_API_KEY` debe tener una clave válida; `/api/health` verifica la autenticación y que el modelo configurado aparezca en el catálogo. Responde `503` si falta la clave, AI Gateway la rechaza, falla la conexión o no encuentra el modelo. No genera una respuesta de prueba, así que los bloqueos de proveedor o presupuesto se detectan al enviar un mensaje en el chat.

Si el formulario no muestra **Health Check Path**, guarda `/api/health` después desde la configuración del servicio. Antes de pulsar **Create Web Service**, confirma el plan y su precio mensual.

Cuando el despliegue termine, abre la URL `onrender.com` que Render asigna al servicio y comprueba que la página cargue. También puedes abrir `https://TU-SERVICIO.onrender.com/api/health`; debe responder con `"ready": true`, `"provider": "gateway"` y el modelo configurado.

No hace falta configurar Ollama en Render. Para usar la app localmente, `AI_PROVIDER` conserva `ollama` como valor predeterminado. El plan de Render y el consumo del modelo en AI Gateway son cobros distintos; verifica ambos antes de activar el servicio y revisa el presupuesto de AI Gateway.

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
- El servidor limita el historial y el tamaño de los mensajes; también limita solicitudes por IP con una tabla de tamaño acotado.
- La app ofrece formato Markdown seguro para respuestas del asistente (negritas, cursivas, listas, títulos, código y enlaces).
- Cuando detecta una intención clara de contratación, muestra un enlace de WhatsApp con un mensaje preparado para Camilo Esquiaqui. El cliente revisa y envía el mensaje; la app no lo envía ni integra WhatsApp Business, Instagram o un CRM.
- GitHub Pages puede servir la interfaz estática, pero no ejecuta este backend Node.js. Para publicar el chat completo, sigue la configuración de Render descrita arriba; allí se usa AI Gateway y no el Ollama de tu computador.
