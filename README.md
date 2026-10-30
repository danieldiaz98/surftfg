# SurfTFG

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-7-119EFF?logo=capacitor&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)
![Android](https://img.shields.io/badge/Android-App-3DDC84?logo=android&logoColor=white)

Aplicación web y móvil para la comunidad surfista: descubre spots, consulta el tiempo, comparte fotos, sigue a otros usuarios y compra o vende material de surf.

El frontend está construido con **React + Vite** y se empaqueta para **Android** mediante **Capacitor**. La autenticación, los datos y el almacenamiento se gestionan con **Supabase**, mientras que la meteorología y los mapas se apoyan en **Stormglass** y **Google Maps**.

## Características

- **Autenticación** con Supabase (registro, login y rutas privadas).
- **Spots de surf** con listado, ficha detallada y mapa interactivo.
- **Meteorología** del spot mediante la API de Stormglass.
- **Galería de fotos** con subida de imágenes.
- **Perfiles de usuario** y explorador de usuarios.
- **Sistema de seguimiento**: seguir/dejar de seguir, lista de seguidores y estadísticas.
- **Marketplace**: publicar productos, ver catálogo y gestionar tus productos.
- **Favoritos** de spots y productos.
- **Interfaz responsive** con React-Bootstrap.
- **App Android** generada con Capacitor.

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 19, React Router 7, React-Bootstrap / Bootstrap 5 |
| Build | Vite 6 |
| Backend / Auth | Supabase (Auth, Database, Storage) |
| Mapas | `@react-google-maps/api` |
| Meteorología | Stormglass API |
| Chat UI | `@chatscope/chat-ui-kit-react` |
| Móvil | Capacitor 7 (Android) |
| Calidad | ESLint |

## Estructura del proyecto

```text
surftfg/
├── projects/
│   └── surf-react/              # Aplicación React + Capacitor
│       ├── src/
│       │   ├── components/      # Páginas y componentes de UI
│       │   ├── context/         # Contexto de autenticación
│       │   ├── supabase/        # Cliente y servicios de datos
│       │   ├── SpotInfo/        # Lógica de localización y clima
│       │   ├── Password/        # Utilidades de contraseñas
│       │   ├── Router.jsx
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── android/             # Proyecto Android (Capacitor)
│       ├── capacitor.config.json
│       ├── vite.config.js
│       └── package.json
├── package.json
└── README.md
```

## Requisitos

- Node.js 18+ y npm
- Android Studio (solo para la versión móvil)
- Un proyecto de Supabase
- Claves de Google Maps y Stormglass

## Configuración

Crea el archivo `projects/surf-react/.env` a partir del ejemplo:

```bash
cd projects/surf-react
cp .env.example .env
```

Rellena las variables:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_STORMGLASS_API_KEY=tu_api_key
VITE_GOOGLE_MAPS_API_KEY=tu_api_key
```

> Las claves `.env` **no deben subirse al repositorio**. Usa `.env.example` como plantilla.

## Ejecución web

```bash
cd projects/surf-react
npm install
npm run dev
```

Vite levantará la aplicación en `http://localhost:5173`.

## Build de producción

```bash
cd projects/surf-react
npm run build
npm run preview
```

## Versión Android

1. Genera el build web:

   ```bash
   cd projects/surf-react
   npm run build
   ```

2. Sincroniza y abre el proyecto Android:

   ```bash
   npx cap sync android
   npx cap open android
   ```

3. En Android Studio, compila y ejecuta la app en un emulador o dispositivo.

## Scripts disponibles

Ejecutar dentro de `projects/surf-react`:

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualiza el build |
| `npm run lint` | Análisis estático con ESLint |

## Notas

- Este proyecto nació como Trabajo de Fin de Grado.
- Recuerda rotar cualquier clave que haya estado expuesta en el historial de Git antes de publicar el repositorio.

## Licencia

Proyecto con fines educativos y de portfolio. Consulta con el autor antes de un uso comercial.
