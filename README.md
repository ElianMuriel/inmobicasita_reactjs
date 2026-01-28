# 🏠 InmobiCasita - Frontend React

Frontend de la aplicación web para gestión inmobiliaria InmobiCasita, desarrollado con React, Vite y Material-UI.

## 🚀 Características

- **React 18** con Vite
- **Material-UI (MUI)** para componentes modernos
- **React Router DOM** para navegación
- **Autenticación JWT** con roles (ADMIN, VENDEDOR, CLIENTE)
- **Control de acceso basado en roles (RBAC)**
- **Diseño responsive** y moderno

## 📋 Roles y Permisos

### 👤 CLIENTE
- Ver propiedades disponibles
- Contactar vendedores
- Solicitar compra/arriendo de propiedades

### 🏢 VENDEDOR
- Crear y editar inmuebles
- Gestionar citas programadas
- Ver estadísticas de sus propiedades
- **NO puede eliminar** inmuebles

### 🔐 ADMIN
- Control total del sistema
- Gestionar todas las entidades (CRUD completo)
- Ver estadísticas generales

## 🛠️ Tecnologías

- **React 18.2.0**
- **Vite 5.0.8**
- **Material-UI 7.3.7**
- **React Router DOM 6.20.0**
- **Axios 1.6.2**
- **date-fns 2.30.0**

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## 🧪 Credenciales de Prueba

Para probar el sistema localmente o en producción, usa estas credenciales:

### Admin
- **Email**: admin@example.com
- **Contraseña**: admin123

### Vendedor
- **Email**: vendedor@example.com
- **Contraseña**: vendedor123

### Cliente
- **Email**: cliente@example.com
- **Contraseña**: cliente123

> **Nota**: Las credenciales pueden variar según tu backend. Consulta la configuración de tu API Django.

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` para desarrollo:

```env
VITE_API_URL=http://localhost:8000/api
```

Para producción, crea `.env.production`:

```env
VITE_API_URL=https://tu-api-produccion.com/api
```

O configura en GitHub Secrets para despliegue automático.

## 🌐 Despliegue

Este proyecto está configurado para despliegue automático en VPS con Nginx usando GitHub Actions.

Ver la guía completa en: [`DESPLIEGUE_VPS.md`](./DESPLIEGUE_VPS.md)

### Configuración rápida:

1. Configura los Secrets en GitHub (ver `DESPLIEGUE_VPS.md`)
2. Haz push a la rama `main`
3. GitHub Actions desplegará automáticamente

## 📁 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables (Layouts, Modal, DataTable)
├── config/          # Configuración (API base URL)
├── contexts/        # Context API (AuthContext)
├── hooks/           # Custom hooks (useResource)
├── pages/           # Páginas de la aplicación
│   ├── admin/       # Páginas del panel de administración
│   ├── auth/        # Páginas de autenticación
│   ├── public/      # Páginas públicas
│   └── vendedor/    # Páginas del panel de vendedor
├── services/        # Servicios API (authService, resourceService)
├── styles/          # Estilos globales
└── theme.js         # Tema de Material-UI
```

## 🔗 Enlaces

- **Frontend**: https://inmobi-casita.desarrollo-software.xyz
- **Backend API**: http://20.171.254.45/api

## 📝 Documentación

### Entrega Académica
- [`CUMPLIMIENTO_REQUISITOS.md`](./CUMPLIMIENTO_REQUISITOS.md) - Verificación de requisitos de entrega
- [`EVIDENCIA_FUNCIONAL.md`](./EVIDENCIA_FUNCIONAL.md) - Guía para grabar video y capturar pantallas
- [`DESPLIEGUE_CICD.md`](./DESPLIEGUE_CICD.md) - Configuración de CI/CD con GitHub Actions

### Despliegue
- [`DESPLIEGUE_VPS.md`](./DESPLIEGUE_VPS.md) - Guía completa de despliegue en VPS
- [`COMANDOS_RAPIDOS_VPS.md`](./COMANDOS_RAPIDOS_VPS.md) - Comandos rápidos

### Configuración
- [`CREAR_REPOSITORIO_GITHUB.md`](./CREAR_REPOSITORIO_GITHUB.md) - Configurar repositorio

## 👨‍💻 Desarrollo

### Scripts disponibles

- `npm run dev` - Inicia servidor de desarrollo (puerto 3000)
- `npm run build` - Construye para producción (genera `dist/`)
- `npm run preview` - Preview de la build de producción

### Desarrollo local

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Crea `.env.local` con `VITE_API_URL=http://localhost:8000/api`
4. Ejecuta: `npm run dev`

## 📄 Licencia

Proyecto académico - InmobiCasita
