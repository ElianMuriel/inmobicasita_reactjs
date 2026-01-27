# Configuración para Conectar con API en Azure

Este documento explica cómo configurar el frontend para conectarse con tu API de Django en Azure.

## 🔧 Configuración de la URL de la API

### Opción 1: Variable de Entorno (Recomendado)

1. **Crear archivo `.env` en la raíz del proyecto**:
   ```env
   VITE_API_URL=https://tu-dominio-azure.azurewebsites.net/api
   ```
   
   Reemplaza `https://tu-dominio-azure.azurewebsites.net/api` con la URL real de tu API en Azure.

2. **Reiniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

### Opción 2: Modificar directamente el archivo de configuración

Edita `src/config/api.js`:

```javascript
// Cambiar esta línea:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Por:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tu-dominio-azure.azurewebsites.net/api'
```

## 🔍 Cómo Obtener la URL de tu API en Azure

1. Ve al portal de Azure: https://portal.azure.com
2. Busca tu App Service (donde está desplegado tu backend Django)
3. En la página de Overview, copia la URL (algo como: `https://inmobicasita-api.azurewebsites.net`)
4. Agrega `/api` al final: `https://inmobicasita-api.azurewebsites.net/api`

## ⚙️ Configuración del Backend en Azure

Asegúrate de que tu backend Django tenga configurado:

### 1. CORS para permitir el frontend

En `inmobicasita_api/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Para desarrollo local
    "https://tu-frontend.vercel.app",  # URL de producción del frontend
    # Agrega aquí la URL donde esté desplegado tu frontend
]

# O para desarrollo, permitir todos (NO usar en producción)
# CORS_ALLOW_ALL_ORIGINS = True
```

### 2. ALLOWED_HOSTS

```python
ALLOWED_HOSTS = [
    'tu-dominio-azure.azurewebsites.net',
    'localhost',
    '127.0.0.1',
]
```

### 3. Variables de Entorno en Azure

En el portal de Azure, ve a tu App Service → Configuration → Application settings y agrega:

- `DJANGO_SECRET_KEY`: Tu secret key
- `DEBUG`: `False` (para producción)
- Cualquier otra variable que necesites

## 🧪 Probar la Conexión

1. **Inicia el frontend**:
   ```bash
   npm run dev
   ```

2. **Abre el navegador** en `http://localhost:3000`

3. **Abre la consola del navegador** (F12) y verifica:
   - No hay errores de CORS
   - Las peticiones van a la URL correcta de Azure
   - El login funciona correctamente

## 🔐 Autenticación y Roles

El sistema detecta automáticamente el rol del usuario desde el token JWT. Asegúrate de que tu backend envíe:

- `is_staff`: Para usuarios ADMIN
- `rol` o `tipo_usuario`: Para identificar VENDEDOR o CLIENTE
- O cualquier campo que uses para identificar roles

### Si tu backend usa un campo diferente para roles:

Edita `src/services/authService.js` y ajusta la lógica de detección de roles:

```javascript
// Línea ~25-35, ajusta según tu backend:
let rol = 'CLIENTE' // Por defecto
if (payload.is_staff === true) {
  rol = 'ADMIN'
} else if (payload.rol) {
  rol = payload.rol.toUpperCase()
} else if (payload.tipo_usuario) {
  rol = payload.tipo_usuario.toUpperCase()
} else if (payload.is_vendedor === true) {
  rol = 'VENDEDOR'
}
```

## 📝 Checklist

- [ ] URL de la API configurada en `.env` o `src/config/api.js`
- [ ] CORS configurado en el backend para permitir el frontend
- [ ] ALLOWED_HOSTS incluye el dominio de Azure
- [ ] Variables de entorno configuradas en Azure
- [ ] El backend está desplegado y funcionando
- [ ] Probar login con un usuario de cada rol (ADMIN, VENDEDOR, CLIENTE)

## 🐛 Troubleshooting

### Error: CORS policy

**Solución**: Verifica que CORS esté configurado en el backend y que la URL del frontend esté en `CORS_ALLOWED_ORIGINS`.

### Error: Network Error

**Solución**: 
- Verifica que la URL de la API sea correcta
- Verifica que el backend esté ejecutándose en Azure
- Revisa los logs del App Service en Azure

### Error: 401 Unauthorized

**Solución**: 
- Verifica que el endpoint de login sea correcto: `/api/auth/login/`
- Revisa que el backend esté devolviendo tokens correctamente

### Los roles no se detectan correctamente

**Solución**: 
- Revisa qué campos envía tu backend en el token JWT
- Ajusta la lógica en `src/services/authService.js` según tu backend

---

**Nota**: Una vez configurado, el frontend debería funcionar completamente con tu API en Azure. Si tienes problemas, revisa la consola del navegador y los logs del backend en Azure.
