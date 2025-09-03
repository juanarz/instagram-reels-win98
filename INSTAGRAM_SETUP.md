# 🔧 Configuración de Instagram API

## Pasos para Conectar tu Cuenta de Instagram

### 1. Crear Aplicación en Facebook Developers

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Haz clic en "My Apps" → "Create App"
3. Selecciona "Consumer" como tipo de aplicación
4. Completa la información básica:
   - **App Name**: Instagram Reels Stats
   - **Contact Email**: tu email
   - **App Purpose**: Yourself or your own business

### 2. Configurar Instagram Basic Display

1. En el dashboard de tu app, haz clic en "Add Product"
2. Busca "Instagram Basic Display" y haz clic en "Set Up"
3. Ve a "Instagram Basic Display" → "Basic Display"
4. Haz clic en "Create New App"
5. Completa:
   - **Display Name**: Instagram Reels Stats
   - **Valid OAuth Redirect URIs**: `http://localhost:3000/auth/callback`
   - **Deauthorize Callback URL**: `http://localhost:3000/auth/deauthorize`
   - **Data Deletion Request URL**: `http://localhost:3000/auth/delete`

### 3. Obtener Credenciales

1. En "Instagram Basic Display" → "Basic Display"
2. Copia el **Instagram App ID** y **Instagram App Secret**
3. Actualiza el archivo `.env`:

```env
REACT_APP_INSTAGRAM_APP_ID=tu_app_id_aqui
REACT_APP_INSTAGRAM_APP_SECRET=tu_app_secret_aqui
REACT_APP_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 4. Agregar Usuario de Prueba

1. Ve a "Instagram Basic Display" → "Basic Display"
2. Scroll hasta "User Token Generator"
3. Haz clic en "Add or Remove Instagram Testers"
4. Agrega tu cuenta de Instagram como tester
5. Acepta la invitación en tu cuenta de Instagram

### 5. Ejecutar la Aplicación

```bash
npm start
```

## ⚠️ Limitaciones Importantes

### Instagram Basic Display API
- **Solo datos básicos**: No incluye métricas detalladas (views, engagement)
- **Cuentas personales**: Funciona con cuentas personales de Instagram
- **Sin insights**: No proporciona estadísticas de rendimiento

### Para Métricas Completas (Opcional)
Si necesitas estadísticas reales, debes:
1. Convertir tu cuenta a **Instagram Business/Creator**
2. Conectarla a una **página de Facebook**
3. Usar **Instagram Graph API** en lugar de Basic Display API

## 🔍 Funcionalidades Implementadas

### ✅ Funcionando
- Autenticación OAuth con Instagram
- Obtención de posts/reels del usuario
- Transformación de datos al formato de la app
- Interfaz de conexión/desconexión
- Manejo de errores y estados de carga

### 📊 Datos Mostrados
- **Título**: Extraído de la primera línea del caption
- **Thumbnail**: URL de la miniatura del reel
- **Fecha**: Timestamp de publicación
- **Estadísticas**: Simuladas (ya que Basic Display API no las proporciona)

## 🚀 Próximos Pasos

1. Configura tu app en Facebook Developers
2. Actualiza las credenciales en `.env`
3. Ejecuta `npm start`
4. Haz clic en "Connect Instagram Account"
5. Autoriza la aplicación
6. ¡Disfruta viendo tus reels con estilo Windows 98!

## 🐛 Solución de Problemas

### Error: "Invalid App ID"
- Verifica que el App ID en `.env` sea correcto
- Asegúrate de no tener espacios extra

### Error: "Redirect URI Mismatch"
- Confirma que la URI de redirección sea exactamente: `http://localhost:3000/auth/callback`

### Error: "User not authorized"
- Agrega tu cuenta como Instagram Tester
- Acepta la invitación en Instagram

### No se cargan los reels
- Verifica que tengas videos publicados en tu cuenta
- La app filtra solo contenido de tipo VIDEO
