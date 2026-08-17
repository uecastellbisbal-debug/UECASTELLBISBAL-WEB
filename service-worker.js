/* Service worker mínimo, solo para que Chrome/Android considere la web
   "instalable" (lo exige junto al manifest.json para poder disparar el
   diálogo de "Instalar app"). No cachea nada a propósito: cada petición
   va siempre a la red, para que los datos de Google Sheets y el resto
   del contenido nunca se queden desactualizados. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(fetch(evento.request));
});
