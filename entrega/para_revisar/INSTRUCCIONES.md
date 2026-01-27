# Instrucciones de Configuración - InmobiCasita Frontend

## ⚠️ IMPORTANTE: Si ves el error "npm no se reconoce"

**Solución rápida**: Ver `SOLUCION_RAPIDA.md` o `INSTALACION_NODEJS.md`

Necesitas instalar Node.js primero antes de continuar.

## Configuración Inicial

### 0. Verificar Node.js (si no está instalado, ver archivos mencionados arriba)

```bash
node --version
npm --version
```

### 1. Instalación de Dependencias

```bash
cd frontend
npm install
```

### 2. Configuración del Backend (CORS)

Para que el frontend pueda comunicarse con el backend Django, necesitas configurar CORS en el backend.

**En `inmobicasita_api/inmobicasita_api/settings.py`**, agrega:

```python
INSTALLED_APPS = [
    # ... otras apps
    'corsheaders',  # Agregar esto
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Agregar al inicio
    'django.middleware.common.CommonMiddleware',
    # ... otros middlewares
]

# Configuración CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# O para desarrollo, permitir todos (NO usar en producción)
# CORS_ALLOW_ALL_ORIGINS = True
```

**Instalar django-cors-headers en el backend:**

```bash
pip install django-cors-headers
```

Agregar a `requirements.txt`:
```
django-cors-headers==4.3.1
```

### 3. Variables de Entorno

Crear archivo `.env` en `frontend/` (opcional):

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### 4. Ejecutar el Proyecto

**Terminal 1 - Backend:**
```bash
cd inmobicasita_api
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Usuarios de Prueba

Asegúrate de tener un usuario administrador en el backend:

```bash
python manage.py createsuperuser
```

Usa este usuario para iniciar sesión en el frontend.

## Estructura de Rutas

### Rutas Públicas
- `/` - Página de inicio
- `/about` - Sobre nosotros
- `/propiedades` - Catálogo público de propiedades
- `/login` - Inicio de sesión

### Rutas Privadas (Requieren autenticación)
- `/admin` - Dashboard
- `/admin/propietarios` - Gestión de propietarios
- `/admin/clientes` - Gestión de clientes
- `/admin/inmuebles` - Gestión de inmuebles
- `/admin/tipos-inmueble` - Gestión de tipos de inmueble
- `/admin/visitas` - Gestión de visitas
- `/admin/contratos` - Gestión de contratos
- `/admin/pagos` - Gestión de pagos
- `/admin/roles` - Gestión de roles

## Solución de Problemas

### Error: "npm: ejecución de scripts está deshabilitada"
- **Solución**: Ver `SOLUCION_POWERSHELL.md` para cambiar la política de ejecución
- **Alternativa rápida**: Usar CMD en lugar de PowerShell

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"
- **Solución**: Configurar CORS en el backend Django (ver arriba)

### Error: "401 Unauthorized"
- **Solución**: Verificar que el token esté siendo enviado. Revisar localStorage en DevTools.

### Error: "Network Error"
- **Solución**: Verificar que el backend esté ejecutándose en `http://127.0.0.1:8000`

### Los tokens no se renuevan automáticamente
- **Solución**: Verificar que el endpoint `/api/auth/refresh/` esté disponible en el backend

### No puedo crear/editar/eliminar registros
- **Solución**: Verificar que el usuario tenga `is_staff=True` en el backend

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Verificar estructura
npm list
```

## Notas de Desarrollo

1. **Hot Reload**: Vite recarga automáticamente los cambios
2. **Proxy**: El proxy en `vite.config.js` redirige `/api` al backend
3. **Tokens**: Se almacenan en `localStorage` (revisar en DevTools > Application > Local Storage)
4. **Console**: Revisar la consola del navegador para errores de JavaScript

## Próximos Pasos

1. Configurar variables de entorno para producción
2. Implementar manejo de errores más robusto
3. Agregar notificaciones toast en lugar de alerts
4. Implementar tests unitarios
5. Optimizar imágenes y assets

---

**¿Problemas?** Revisa la consola del navegador y los logs del backend Django.
