# Asistente comercial de L’Orage Media

Prototipo local de interfaz para conversar con prospectos, orientar sobre el tarifario y simular el traspaso a un asesor.

## Abrir

Abre `index.html` en un navegador moderno. No requiere instalar paquetes ni servidor.

## Alcance actual

- Incluye respuestas guiadas con precios y servicios del tarifario compartido.
- Permite explorar Sistema IA Comercial, contenido/redes, pauta y desarrollo web.
- Recoge un nombre al pedir contacto y arma un resumen visible del prospecto.
- El traspaso es una demostración: no se envía información ni se notifica a un asesor.
- No hay modelo de IA conectado y no se integra con WhatsApp, Instagram ni CRM.

## Siguiente etapa para llevarlo a producción

1. Elegir el canal inicial y el proveedor de mensajería (por ejemplo, WhatsApp Business Platform o Instagram Messaging).
2. Definir dónde recibirá el asesor las conversaciones (CRM, bandeja compartida o notificación) y qué datos se deben solicitar.
3. Crear un backend con un modelo de IA, base de conocimiento revisada y reglas que impidan inventar precios o condiciones.
4. Conectar el backend al canal, crear la asignación/notificación de asesor y registrar el consentimiento y los datos necesarios.
5. Probar conversaciones de compra, dudas, casos fuera del tarifario y solicitudes de atención humana antes de activar el canal.

Las credenciales de plataformas deben guardarse como variables de entorno en el backend, nunca en el navegador.
