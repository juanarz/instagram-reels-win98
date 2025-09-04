# 📹 Instagram Reels Statistics - Windows 98 Edition

Una página web React con estilo retro de Windows 98 que muestra estadísticas de reels de Instagram más populares.

🌐 **Demo en vivo**: [Ver aplicación](https://juanarz.github.io/instagram-reels-win98/)

## Características

- **Diseño Windows 98**: Utiliza 98.css para replicar la interfaz clásica
- **Ventanas Retro**: Cada reel se muestra en una ventana estilo Windows 98 con barra de título y botones funcionales
- **Estadísticas Detalladas**: Views, likes, comments, shares, saves y engagement rate
- **Layout Responsivo**: 3 columnas en desktop, 2 en tablet, 1 en móvil
- **Popup de Estadísticas**: Botón flotante "Más" que muestra estadísticas generales
- **Barra de Inicio**: Simula el menú clásico de Windows 98
- **Fuentes Retro**: Tahoma y MS Sans Serif para autenticidad

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar la aplicación:
```bash
npm start
```

3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Estructura del Proyecto

- `src/App.js` - Componente principal con toda la lógica
- `src/index.css` - Estilos personalizados Windows 98
- `public/index.html` - HTML base con 98.css y TailwindCSS

## Funcionalidades

### Ventanas de Reels
- Minimizar/maximizar ventanas
- Estadísticas en formato tabla retro
- Thumbnails con emojis
- Cálculo automático de engagement rate

### Popup de Estadísticas
- Totales y promedios generales
- Insights clave del rendimiento
- Diseño modal estilo Windows 98

### Responsividad
- Desktop: 3 columnas
- Tablet (≤768px): 2 columnas  
- Móvil (≤480px): 1 columna

## Tecnologías

- React 18
- 98.css (estilos Windows 98)
- TailwindCSS (utilidades CSS)
- Fuentes Google (Tahoma)

## Datos de Ejemplo

La aplicación incluye 6 reels de ejemplo con diferentes métricas para demostrar la funcionalidad.
