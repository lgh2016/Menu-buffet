# PRD — Los Andariegos · Buffet Mar y Tierra (Menú Digital)

## Problem statement original
Convertir el menú físico del restaurante Los Andariegos (Buffet Mar y Tierra) en un menú digital responsive, conservando al 100% la identidad visual (fondo blanco, encabezados azules, nombres en rojo/naranja, precios en azul), el logo oficial, TODOS los platillos, categorías, precios exactos y tiempos de preparación. Sin backend, sin carrito, sin reservaciones, sin login. Animaciones sutiles y elegantes. Navegación por categorías con barra horizontal deslizable en móvil. Datos separados de la presentación. Carga rápida para uso vía QR.

## Arquitectura
- Frontend-only (React + Tailwind + framer-motion + lenis). Sin backend en uso.
- Datos del menú: `/app/frontend/src/data/menuData.js` (categorías → productos → precios/tiempos). Editar ahí para cambiar precios o productos sin tocar el diseño.
- Componentes: `Hero.jsx` (portada con logo oficial), `CategoryNav.jsx` (barra sticky deslizable), `MenuSection.jsx` (tarjeta de categoría), `PhotoBreak.jsx` (fotos entre grupos), `Decor.jsx` (SVGs: cítrico, ola, flama, camarón).
- Assets: `/app/frontend/public/images/` (logo oficial, fotos).
- Scripts de utilidad: `/app/backend/gen_images.py` (genera fotos con Gemini Nano Banana), `/app/backend/crop_photos.py` (recorta fotos reales del menú físico y optimiza).

## Personas
- Comensal en mesa que escanea el QR desde su celular (prioridad móvil 360px+).
- Personal del restaurante que edita precios/productos en `menuData.js`.

## Requisitos core (estáticos)
- Identidad visual intacta: blanco, azul #1a58b0, naranja #c1440e, tipografías Alfa Slab One + Oswald.
- 18 categorías, todos los productos y precios EXACTOS del menú físico.
- Logo oficial sin alteraciones.
- Responsive: 1 columna móvil, 2 columnas (masonry) en tablet/escritorio.
- Animaciones sutiles: fade-in al hacer scroll, microinteracciones en navegación, scroll suave (lenis).
- Sin carrito, sin pedidos, sin login, sin backend.

## Implementado (2026-09-15)
- Sistema de buffets por temporada con backend (FastAPI + MongoDB): colección `buffets` (categorías, productos, tema visual, fechas de creación/modificación, campos futuros validFrom/validTo/branch) y colección `drinks` (catálogo global único, compartido por todos los buffets).
- Endpoints: GET /api/menu/public (buffet activo + bebidas, filtra ocultos), CRUD de buffets, duplicar (copia independiente), activar/desactivar (solo uno activo), GET/PUT /api/drinks, POST /api/upload (imágenes a /api/uploads/).
- Panel admin sin login: /admin/buffets (lista, crear vacío o duplicando, activar "Usar este buffet", desactivar, editar), /admin/buffets/:id (editor: nombre, personalización con colores/hero/fondo/banner/decorativa, categorías y platillos con agregar/eliminar/ocultar/ordenar/mover entre categorías), /admin/bebidas (editor del catálogo global reutilizando el mismo componente).
- Menú público dinámico: consulta el buffet activo al cargar y aplica su tema vía variables CSS; las bebidas globales heredan el tema del buffet activo. Cambiar de buffet no requiere redeploy.
- Buffets sembrados: "Buffet Tradicional" (activo, tema azul/naranja original, 13 categorías) y "Buffet 15 de Septiembre" (inactivo, tema verde/blanco/rojo, categorías Entrada/Segundo tiempo/Tercer tiempo/Guarniciones con los platillos solicitados).
- Plantillas visuales por buffet: `theme.template` ("classic" | "mexican-independence"), seleccionable en Personalización del editor. La plantilla "mexican-independence" (componentes en `src/components/september/`, estilos `.sept-*` en index.css) renderiza una experiencia oscura premium de fiestas patrias: hero con jinetes al atardecer, papel picado, brasas flotantes, logo con anillo dorado, tarjetas artesanales oscuras con acentos oro/verde/rojo, recorrido por tiempos, transición "Brinda al estilo Los Andariegos" hacia las bebidas globales (mismo tema oscuro). Solo aplica al buffet que la tenga configurada; el resto usa la plantilla clásica intacta.
- El archivo src/data/menuData.js quedó como referencia histórica; el menú ya se alimenta de MongoDB.

## Implementado (2026-09-10)
- Actualización del apartado de bebidas según nueva imagen oficial: CERVEZA renovada (entran Pacífico $76, Negra Modelo $89, Modelo Especial $89, Corona $69, Victoria $69, Andariega de Camarón 960 ml $249; sale Indio, Tecate, XX Lager, XX Ambar, Heineken, Bohemia Clara/Obscura, Camarochela 1 LT; Ultra $75→$89). Bebidas, Coctelería y Cebadas quedaron idénticas.
- Corrección de tarjetas CAFÉ y CREPAS FLAMBEADAS: los archivos descargados del menú estaban intercambiados (menu-cafe-postres.jpeg contiene la página de comida y menu-comida.jpeg la de café/postres); se re-cortaron las fotos reales desde la página correcta eliminando fragmentos de texto.
- Hook `useScreenWakeLock` (`/app/frontend/src/hooks/useScreenWakeLock.js`) usado en `App.js`: mantiene la pantalla activa con la Screen Wake Lock API mientras el menú está visible; se libera al ocultar la pestaña/salir y se re-solicita al volver; tolerante a navegadores sin soporte o con permiso denegado.
- Nueva categoría SERVICIOS (grupo bebidas, después de CERVEZA): MICHELADO $25, CUBANO $25 y CLAMATO PARA CERVEZA $35; aparece automáticamente en la barra de navegación.
- Portada con logo oficial, revelado animado "BUFFET MAR Y TIERRA" y botón "Ver menú".
- Barra de categorías sticky, deslizable, con estado activo por IntersectionObserver y scroll suave con lenis.
- Las 18 categorías completas con productos, precios y tiempos de preparación verificados contra las imágenes originales.
- Fotos: camarones y mojarra generadas con IA realista; café, crepas, michelada y cerveza recortadas de las fotos reales del menú físico (la clave universal se quedó sin presupuesto tras 2 generaciones).
- Marquee editorial lento entre portada y menú; decoración SVG de cítricos/olas; footer con logo.
- Metadatos en español, favicon con el logo, imágenes optimizadas (≤60 KB c/u).

## Verificación
- Screenshots escritorio (1920px) y móvil (390px): portada, navegación por categorías, secciones, fotos y footer correctos.
- Precios contrastados visualmente contra las imágenes del menú (bebidas, coctelería, cebadas, cerveza, café, postres, helados $149).

## Backlog
- P1: Foto de corte en espada (requiere recargar saldo de la clave universal o foto real del restaurante).
- P2: Botón "volver arriba" en móvil.
- P2: Versión imprimible / PDF.
- P2: Modo oscuro opcional (solo si el restaurante lo pide; hoy la marca es fondo blanco).

## Siguientes tareas
1. Recargar saldo de clave universal si se quieren más fotos generadas (Perfil → Manage plan → Universal Key → Add Balance).
2. Confirmar con el restaurante los nombres con posibles typos del original ("FESAS JUBILEE", "CHICHARRON DE REB EYE", "NUGUETS") — se conservaron tal cual por instrucción.
3. Generar el QR apuntando a la URL publicada.
