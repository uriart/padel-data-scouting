# Padel Data Scouting

Progressive Web App (PWA) para hacer *scouting* de partidos de pádel en tiempo real, con estadísticas compartibles y almacenamiento offline.

## 🚀 Tecnologías
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- IndexedDB para almacenamiento offline
- Diseño como PWA para funcionar sin conexión
- Preparada para integración con funciones serverless y base de datos en la nube

## ✨ Funcionalidades
- Registro de eventos de un partido de pádel en tiempo real.
- Generación automática de estadísticas del partido.
- Visualización de gráficos y métricas de rendimiento.
- Exportación de estadísticas en formato CSV.
- Modo offline gracias a IndexedDB.
- Compartir estadísticas fácilmente mediante enlace (requiere backend ligero).

## 📦 Instalación y uso
```bash
# Clonar repositorio
git clone https://github.com/uriart/padel-scouting-app.git
cd padel-data-scouting

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir versión de producción
npm run build
```

## 🛠 Próximos pasos
- Integración con backend serverless (Cloudflare / Firebase / Supabase).
- Mejoras en UI/UX.
- Autenticación opcional para guardar partidos en la nube.

## 📄 Licencia
Este proyecto se distribuye bajo la licencia MIT.  
¡Contribuciones son bienvenidas!
