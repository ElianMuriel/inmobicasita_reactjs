# Documentación de Despliegue CI/CD - InmobiCasita Frontend

Este documento describe el proceso de despliegue continuo (CI/CD) para el frontend de InmobiCasita desarrollado en React.

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Estrategia de CI/CD](#estrategia-de-cicd)
3. [Configuración de GitHub Actions](#configuración-de-github-actions)
4. [Despliegue en Vercel](#despliegue-en-vercel)
5. [Despliegue en Netlify](#despliegue-en-netlify)
6. [Despliegue en AWS S3 + CloudFront](#despliegue-en-aws-s3--cloudfront)
7. [Variables de Entorno](#variables-de-entorno)
8. [Pipeline de CI/CD Completo](#pipeline-de-cicd-completo)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción

El despliegue continuo (CI/CD) permite automatizar el proceso de construcción, pruebas y despliegue de la aplicación React cada vez que se realizan cambios en el código. Esto garantiza:

- **Integración Continua (CI)**: Verificación automática del código en cada commit
- **Despliegue Continuo (CD)**: Despliegue automático a producción tras verificaciones exitosas

---

## 🔄 Estrategia de CI/CD

### Flujo de Trabajo

```
┌─────────────┐
│   Commit    │
│   Push      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   GitHub    │
│   Actions   │
└──────┬──────┘
       │
       ├──► Instalar dependencias
       ├──► Ejecutar linter
       ├──► Ejecutar tests (si existen)
       ├──► Build del proyecto
       └──► Desplegar a producción
```

### Ramas y Entornos

- **`main` / `master`**: Rama principal → Despliegue a **Producción**
- **`develop`**: Rama de desarrollo → Despliegue a **Staging** (opcional)
- **`feature/*`**: Ramas de características → Solo CI (sin despliegue)

---

## ⚙️ Configuración de GitHub Actions

### 1. Estructura de Directorios

Crear la siguiente estructura en el repositorio:

```
.github/
└── workflows/
    ├── ci.yml          # Pipeline de CI
    └── deploy.yml      # Pipeline de CD
```

### 2. Pipeline de CI (Integración Continua)

Archivo: `.github/workflows/ci.yml`

```yaml
name: CI - Continuous Integration

on:
  push:
    branches: [ main, develop, 'feature/**' ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout código
        uses: actions/checkout@v3
      
      - name: Configurar Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Instalar dependencias
        run: npm ci
      
      - name: Ejecutar linter (ESLint)
        run: npm run lint || echo "Linter no configurado"
      
      - name: Verificar build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL || 'http://127.0.0.1:8000/api' }}
      
      - name: Subir artefactos de build
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist
          retention-days: 1
```

### 3. Pipeline de CD (Despliegue Continuo)

Archivo: `.github/workflows/deploy.yml`

```yaml
name: CD - Continuous Deployment

on:
  push:
    branches: [ main ]
  workflow_dispatch:  # Permite ejecución manual

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout código
        uses: actions/checkout@v3
      
      - name: Configurar Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Instalar dependencias
        run: npm ci
      
      - name: Build del proyecto
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Desplegar a Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🚀 Despliegue en Vercel

Vercel es una plataforma ideal para aplicaciones React/Vite con despliegue automático.

### Opción 1: Despliegue Automático desde GitHub

1. **Conectar repositorio en Vercel**:
   - Ir a [vercel.com](https://vercel.com)
   - Iniciar sesión con GitHub
   - Click en "New Project"
   - Seleccionar el repositorio `inmobicasita_reactjs`
   - Configurar:
     - **Framework Preset**: Vite
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

2. **Configurar Variables de Entorno**:
   ```
   VITE_API_URL=https://api.tudominio.com/api
   ```

3. **Despliegue Automático**:
   - Cada push a `main` despliega automáticamente
   - Vercel crea una URL de preview para cada PR

### Opción 2: Despliegue con GitHub Actions

Usar el workflow `.github/workflows/deploy.yml` configurado anteriormente.

### Configuración Adicional en Vercel

Archivo: `vercel.json` (opcional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🌐 Despliegue en Netlify

Netlify ofrece despliegue continuo similar a Vercel.

### Configuración Manual

1. **Conectar repositorio**:
   - Ir a [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Conectar con GitHub y seleccionar el repositorio

2. **Configurar build**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: `./`

3. **Variables de entorno**:
   ```
   VITE_API_URL=https://api.tudominio.com/api
   ```

### Configuración con Archivo

Archivo: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Despliegue con GitHub Actions

```yaml
- name: Desplegar a Netlify
  uses: nwtgck/actions-netlify@v2.0
  with:
    publish-dir: './dist'
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy desde GitHub Actions"
    enable-pull-request-comment: false
    enable-commit-comment: true
    overwrites-pull-request-comment: true
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## ☁️ Despliegue en AWS S3 + CloudFront

Para un despliegue en AWS más controlado.

### 1. Configurar S3 Bucket

```bash
# Crear bucket
aws s3 mb s3://inmobicasita-frontend-prod

# Configurar para hosting estático
aws s3 website s3://inmobicasita-frontend-prod \
  --index-document index.html \
  --error-document index.html
```

### 2. Configurar CloudFront

1. Crear distribución CloudFront apuntando al bucket S3
2. Configurar `Default Root Object`: `index.html`
3. Agregar `Error Pages`:
   - `403` → `/index.html` (200)
   - `404` → `/index.html` (200)

### 3. GitHub Actions para AWS

```yaml
- name: Configurar AWS CLI
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

- name: Sincronizar con S3
  run: |
    aws s3 sync dist/ s3://inmobicasita-frontend-prod \
      --delete \
      --cache-control "public, max-age=31536000, immutable"

- name: Invalidar CloudFront
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
      --paths "/*"
```

---

## 🔐 Variables de Entorno

### Variables Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API Django | `https://api.tudominio.com/api` |

### Configuración en GitHub Secrets

1. Ir a: `Settings` → `Secrets and variables` → `Actions`
2. Agregar secretos:
   - `VITE_API_URL`: URL de producción de la API
   - `VERCEL_TOKEN`: Token de Vercel (si usas Vercel)
   - `VERCEL_ORG_ID`: ID de organización Vercel
   - `VERCEL_PROJECT_ID`: ID del proyecto Vercel
   - `AWS_ACCESS_KEY_ID`: (si usas AWS)
   - `AWS_SECRET_ACCESS_KEY`: (si usas AWS)

### Configuración en Vercel/Netlify

- **Vercel**: `Project Settings` → `Environment Variables`
- **Netlify**: `Site settings` → `Build & deploy` → `Environment variables`

---

## 🔄 Pipeline de CI/CD Completo

### Flujo Completo con Múltiples Entornos

```yaml
name: CI/CD Completo

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  # Job de CI
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL_STAGING }}
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifact
          path: dist

  # Job de despliegue a Staging (develop)
  deploy-staging:
    needs: ci
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build-artifact
          path: dist
      - name: Desplegar a Staging
        # ... configuración de staging

  # Job de despliegue a Producción (main)
  deploy-production:
    needs: ci
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/download-artifact@v3
        with:
          name: build-artifact
          path: dist
      - name: Desplegar a Producción
        # ... configuración de producción
```

---

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. Error: "VITE_API_URL is not defined"

**Solución**: Asegúrate de que la variable de entorno esté configurada en los secrets de GitHub o en la plataforma de despliegue.

```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

#### 2. Error: "Build failed" en Vercel/Netlify

**Solución**: Verificar que:
- El comando de build sea correcto: `npm run build`
- El directorio de salida sea `dist`
- Las dependencias estén en `package.json`

#### 3. Error: "404 en rutas de React Router"

**Solución**: Configurar redirecciones para SPA:

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 4. Error: CORS en producción

**Solución**: Asegurarse de que el backend Django tenga configurado CORS para el dominio de producción:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://inmobicasita.vercel.app",
    "https://inmobicasita.netlify.app",
]
```

#### 5. Tokens no se renuevan en producción

**Solución**: Verificar que la URL de la API en producción sea correcta y que el backend esté accesible.

---

## 📊 Monitoreo y Notificaciones

### Notificaciones en Slack/Discord

```yaml
- name: Notificar despliegue exitoso
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: "✅ Despliegue exitoso a producción"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Notificaciones por Email

GitHub Actions envía emails automáticamente cuando un workflow falla (si está habilitado en la configuración del repositorio).

---

## 📝 Checklist de Despliegue

Antes de desplegar a producción, verificar:

- [ ] Variables de entorno configuradas correctamente
- [ ] URL de la API de producción es correcta
- [ ] CORS configurado en el backend para el dominio de producción
- [ ] Build local funciona sin errores
- [ ] Tests pasan (si existen)
- [ ] Documentación actualizada
- [ ] Secrets configurados en GitHub/plataforma de despliegue
- [ ] Dominio personalizado configurado (si aplica)
- [ ] SSL/HTTPS habilitado

---

## 🔗 Enlaces Útiles

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 📄 Ejemplo de Configuración Completa

Ver los archivos de ejemplo en:
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `vercel.json` (si usas Vercel)
- `netlify.toml` (si usas Netlify)

---

**Última actualización**: Diciembre 2024
