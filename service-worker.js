/* Service worker: además de lo de siempre (ver abajo), recibe las
   notificaciones push de Firebase Cloud Messaging cuando la web está
   cerrada o en segundo plano.

   Lo demás sigue igual que antes -- este service worker no cachea nada
   a propósito, solo existe para que Chrome/Android considere la web
   "instalable" y ahora también para el push: cada petición normal va
   siempre a la red, para que los datos de Google Sheets y el resto del
   contenido nunca se queden desactualizados. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (evento) => {
  evento.respondWith(fetch(evento.request));
});

/* ---------- Firebase Cloud Messaging (avisos push) ---------- */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAaL_3wpjbBL650ADe111P68K1hALpxsC0",
  authDomain: "uecastellbisbal.firebaseapp.com",
  projectId: "uecastellbisbal",
  storageBucket: "uecastellbisbal.firebasestorage.app",
  messagingSenderId: "981794835763",
  appId: "1:981794835763:web:a41c6c9dfb259bae33c246"
});

const messaging = firebase.messaging();

/* se dispara cuando llega un push y la web NO está abierta en primer
   plano -- aquí es donde se construye la notificación del sistema.
   El aviso se manda como "mensaje de datos" (payload.data), no como
   "mensaje de notificación" (payload.notification) -- si lleva
   "notification", Chrome muestra su propio aviso automático A LA VEZ
   que este, y sale duplicado (uno con icono, el nuestro, y otro sin
   icono, el de Chrome). Con solo "data", el único que se muestra es
   este de aquí. */
messaging.onBackgroundMessage((payload) => {
  const titulo = (payload.data && payload.data.title) || "UE Castellbisbal";
  const opciones = {
    body: (payload.data && payload.data.body) || "",
    icon: "assets/icon-192.png",
    badge: "assets/icon-192.png"
  };
  self.registration.showNotification(titulo, opciones);
});
