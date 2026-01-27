# InmobiCasita - Frontend React

Frontend desarrollado en React para el sistema de gestión inmobiliaria InmobiCasita. Este proyecto consume una API REST desarrollada en Django y proporciona una interfaz completa con sección pública y privada (administración).

## 🚀 Características

### Sección Pública
- **Página de Inicio**: Presentación de la empresa con características destacadas
- **Página Sobre Nosotros**: Información sobre la empresa, misión, visión y valores
- **Catálogo de Propiedades**: Visualización pública de inmuebles con filtros y búsqueda
- **Navegación intuitiva**: Menú de navegación accesible desde todas las páginas

### Sección Privada (Administración)
- **Autenticación JWT**: Sistema de login seguro con tokens
- **Control de acceso por roles**: Solo usuarios con `is_staff=True` pueden acceder
- **Dashboard**: Resumen estadístico del sistema
- **CRUD completo** para todas las entidades:
  - Propietarios
  - Clientes
  - Inmuebles
  - Tipos de Inmueble
  - Visitas
  - Contratos
  - Pagos
  - Roles

### Funcionalidades de Administración
- **Tablas interactivas**: Visualización de datos con ordenamiento
- **Formularios modales**: Crear y editar registros de forma intuitiva
- **Filtros y búsqueda**: Búsqueda en tiempo real en todas las tablas
- **Paginación**: Navegación eficiente de grandes volúmenes de datos
- **Validación de formularios**: Validación tanto en frontend como backend
- **Manejo de errores**: Mensajes de error claros y útiles

## 📋 Requisitos Previos

- Node.js 16+ y npm (o yarn/pnpm)
- Backend Django ejecutándose en `http://127.0.0.1:8000`
- Usuario administrador creado en el backend

## 🛠️ Instalación

1. **Clonar o navegar al directorio del proyecto**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   Crear un archivo `.env` en la raíz del proyecto frontend:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api
   ```
   Si no se especifica, se usará la URL por defecto.

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
inmobicasita_reactjs/
├── .github/
│   └── workflows/         # GitHub Actions para CI/CD
│       ├── ci.yml         # Pipeline de integración continua
│       └── deploy.yml     # Pipeline de despliegue continuo
├── public/                 # Archivos estáticos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Layout.jsx     # Layout principal
│   │   ├── PublicLayout.jsx
│   │   ├── DataTable.jsx  # Tabla de datos reutilizable
│   │   └── Modal.jsx      # Modal reutilizable
│   ├── contexts/          # Contextos de React
│   │   └── AuthContext.jsx # Contexto de autenticación
│   ├── hooks/             # Custom hooks
│   │   └── useResource.js # Hook para gestión de recursos
│   ├── pages/             # Páginas de la aplicación
│   │   ├── public/        # Páginas públicas
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── Propiedades.jsx
│   │   ├── auth/          # Autenticación
│   │   │   └── Login.jsx
│   │   └── admin/         # Panel de administración
│   │       ├── Dashboard.jsx
│   │       ├── Propietarios.jsx
│   │       ├── Clientes.jsx
│   │       ├── Inmuebles.jsx
│   │       ├── TiposInmueble.jsx
│   │       ├── Visitas.jsx
│   │       ├── Contratos.jsx
│   │       ├── Pagos.jsx
│   │       └── Roles.jsx
│   ├── services/          # Servicios API
│   │   ├── api.js         # Configuración de Axios
│   │   ├── authService.js # Servicio de autenticación
│   │   └── resourceService.js # Servicios de recursos
│   ├── config/            # Configuración
│   │   └── api.js         # URL base de la API
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── .gitignore
├── package.json
├── vite.config.js
├── vercel.json            # Configuración de Vercel (opcional)
├── netlify.toml           # Configuración de Netlify (opcional)
├── README.md              # Este archivo
├── DESPLIEGUE_CI_CD.md    # Documentación de CI/CD
└── PRUEBAS_FUNCIONALES.md # Documentación de pruebas
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Login**: El usuario ingresa sus credenciales
2. **Token**: El backend devuelve `access` y `refresh` tokens
3. **Almacenamiento**: Los tokens se guardan en `localStorage`
4. **Interceptores**: Axios agrega automáticamente el token a las peticiones
5. **Renovación**: Si el token expira, se intenta renovar con el `refresh_token`

### Control de Acceso

- **Rutas públicas**: Accesibles sin autenticación (`/`, `/about`, `/propiedades`)
- **Rutas privadas**: Requieren autenticación (`/admin/*`)
- **Rutas de administración**: Requieren `is_staff=True` (verificado en el backend)

## 📡 Consumo de API

El proyecto consume los siguientes endpoints:

### Autenticación
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/refresh/` - Renovar token

### Recursos (CRUD completo)
- `/api/propietarios/`
- `/api/clientes/`
- `/api/inmuebles/`
- `/api/tipos-inmueble/`
- `/api/visitas/`
- `/api/contratos/`
- `/api/pagos/`
- `/api/roles/`

Todos los endpoints soportan:
- `GET` - Listar (con paginación, búsqueda y ordenamiento)
- `GET /{id}/` - Obtener detalle
- `POST` - Crear (requiere autenticación y permisos de admin)
- `PUT /{id}/` - Actualizar (requiere autenticación y permisos de admin)
- `DELETE /{id}/` - Eliminar (requiere autenticación y permisos de admin)

## 🎨 Tecnologías Utilizadas

- **React 18**: Biblioteca de UI
- **React Router 6**: Enrutamiento
- **Vite**: Build tool y servidor de desarrollo
- **Axios**: Cliente HTTP
- **date-fns**: Manipulación de fechas
- **CSS3**: Estilos personalizados

## 🧪 Pruebas Funcionales

### Pruebas de Autenticación
1. ✅ Login con credenciales válidas
2. ✅ Login con credenciales inválidas (muestra error)
3. ✅ Logout (limpia tokens y redirige)
4. ✅ Protección de rutas privadas
5. ✅ Renovación automática de tokens

### Pruebas de CRUD
1. ✅ Listar recursos (con paginación)
2. ✅ Crear nuevos registros
3. ✅ Editar registros existentes
4. ✅ Eliminar registros (con confirmación)
5. ✅ Búsqueda y filtros
6. ✅ Manejo de errores del backend

### Pruebas de UI/UX
1. ✅ Navegación fluida entre páginas
2. ✅ Formularios responsivos
3. ✅ Modales funcionales
4. ✅ Tablas con datos formateados
5. ✅ Mensajes de error claros
6. ✅ Estados de carga

## 🚀 Build para Producción

```bash
npm run build
```

Esto generará una carpeta `dist/` con los archivos optimizados para producción.

Para previsualizar el build:
```bash
npm run preview
```

## 🔄 Despliegue CI/CD

Este proyecto incluye configuración completa para despliegue continuo (CI/CD). Ver la documentación detallada en [DESPLIEGUE_CI_CD.md](./DESPLIEGUE_CI_CD.md).

### Opciones de Despliegue

- **Vercel**: Despliegue automático desde GitHub (recomendado)
- **Netlify**: Alternativa con características similares
- **AWS S3 + CloudFront**: Para mayor control y escalabilidad
- **GitHub Actions**: Pipeline personalizado de CI/CD

### Configuración Rápida

1. **Vercel** (Más fácil):
   - Conectar repositorio en [vercel.com](https://vercel.com)
   - Configurar variable de entorno: `VITE_API_URL`
   - Despliegue automático en cada push a `main`

2. **GitHub Actions**:
   - Los workflows están en `.github/workflows/`
   - Configurar secrets en GitHub: `Settings` → `Secrets and variables` → `Actions`
   - Secrets requeridos: `VITE_API_URL`, `VERCEL_TOKEN` (si usas Vercel)

Ver [DESPLIEGUE_CI_CD.md](./DESPLIEGUE_CI_CD.md) para instrucciones detalladas.

## 📝 Notas Importantes

1. **CORS**: Asegúrate de que el backend Django tenga configurado CORS para permitir peticiones desde `http://localhost:3000` (desarrollo) y desde el dominio de producción

2. **Variables de Entorno**: 
   - Desarrollo: Crear `.env` con `VITE_API_URL=http://127.0.0.1:8000/api`
   - Producción: Configurar en la plataforma de despliegue (Vercel/Netlify/AWS)

3. **Tokens**: Los tokens se almacenan en `localStorage`. En producción, considera usar `httpOnly` cookies para mayor seguridad

4. **Permisos**: El control de acceso se verifica tanto en frontend como en backend. El backend es la fuente de verdad

5. **CI/CD**: El proyecto incluye workflows de GitHub Actions para CI/CD. Ver [DESPLIEGUE_CI_CD.md](./DESPLIEGUE_CI_CD.md) para más detalles

## 📚 Documentación Adicional

Este proyecto incluye documentación detallada en los siguientes archivos:

- **[DESPLIEGUE_CI_CD.md](./DESPLIEGUE_CI_CD.md)**: Guía completa de despliegue continuo e integración continua
  - Configuración de GitHub Actions
  - Despliegue en Vercel, Netlify y AWS
  - Variables de entorno y troubleshooting

- **[PRUEBAS_FUNCIONALES.md](./PRUEBAS_FUNCIONALES.md)**: Documentación de pruebas funcionales
  - Pruebas de autenticación
  - Pruebas de CRUD para todos los recursos
  - Pruebas de UI/UX e integración con API

## ✅ Cumplimiento de Objetivos

Este proyecto cumple con todos los objetivos específicos solicitados:

- ✅ **Interfaz pública**: Navegación y páginas informativas (Home, About, Propiedades)
- ✅ **Autenticación**: Login y manejo de sesión con tokens JWT
- ✅ **Rutas protegidas**: Protección de rutas privadas en React
- ✅ **Control de acceso por roles**: Implementado con `is_staff` (ADMIN)
- ✅ **CRUD completo**: Consumo de endpoints para listar, crear, editar y eliminar recursos
- ✅ **Interfaz de administración**: Tablas, formularios, filtros y paginación
- ✅ **Documentación**: README completo y documentación detallada
- ✅ **Pruebas funcionales**: Documentación de pruebas del consumo de la API
- ✅ **CI/CD**: Documentación completa de despliegue continuo

## 🤝 Contribución

Este proyecto fue desarrollado como parte de un trabajo académico. Para mejoras o correcciones:

1. Revisa el código existente
2. Asegúrate de seguir las convenciones establecidas
3. Prueba tus cambios antes de commitear

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

---

**Desarrollado con ❤️ usando React y Django REST Framework**
