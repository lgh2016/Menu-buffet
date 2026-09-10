import { useEffect, useRef } from "react";

// Mantiene la pantalla del dispositivo activa mientras el comensal consulta el menú
// (útil en mesa, donde el teléfono se apagaría por inactividad a mitad de la lectura).
// Usa la Screen Wake Lock API cuando el navegador la soporta; si no, el menú
// simplemente sigue funcionando normal sin bloquear nada.
const useScreenWakeLock = () => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    // Navegador sin soporte: salimos sin errores ni efectos secundarios.
    if (!("wakeLock" in navigator)) return;

    let released = false;

    const requestLock = async () => {
      try {
        // Se solicita el wake lock solo con la pestaña visible (requisito de la API).
        sentinelRef.current = await navigator.wakeLock.request("screen");
        // Si el sistema lo libera (p. ej. por batería baja), limpiamos la referencia.
        sentinelRef.current.addEventListener("release", () => {
          sentinelRef.current = null;
        });
      } catch {
        // Error al solicitarlo (permiso denegado, batería, etc.): no interrumpe el menú.
        sentinelRef.current = null;
      }
    };

    const releaseLock = async () => {
      // Se libera al salir/cerrar la página, ocultar la pestaña o desmontar el componente,
      // para que el dispositivo recupere su comportamiento normal de suspensión.
      try {
        await sentinelRef.current?.release();
      } catch {
        // Ignorado: liberar dos veces o tras error no debe romper nada.
      }
      sentinelRef.current = null;
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // El sistema libera el lock automáticamente al ocultarse la pestaña;
        // por eso se vuelve a solicitar al recuperar la visibilidad.
        requestLock();
      } else {
        releaseLock();
      }
    };

    requestLock();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (released) return;
      released = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      releaseLock();
    };
  }, []);
};

export default useScreenWakeLock;
