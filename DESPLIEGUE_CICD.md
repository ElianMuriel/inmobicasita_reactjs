# 🚀 Documentación de Despliegue CI/CD - InmobiCasita

Esta documentación explica cómo configurar un pipeline de Integración Continua (CI) y Despliegue Continuo (CD) usando GitHub Actions para desplegar automáticamente el frontend en producción.

## 📋 Tabla de Contenidos

1. [Configuración de GitHub Actions](#configuración-de-github-actions)
2. [Despliegue en VPS con Nginx](#despliegue-en-vps-con-nginx)
3. [Despliegue en Netlify](#despliegue-en-netlify)
4. [Despliegue en Vercel](#despliegue-en-vercel)
5. [Flujo CI/CD Explicado](#flujo-cicd-explicado)

---

## 🔧 Configuración de GitHub Actions

### **Paso 1: Crear la carpeta de workflows**

En tu repositorio, crea la carpeta (si no existe):

```bash
mkdir -p .github/workflows
```

### **Paso 2: Crear archivo de workflow**

Crea `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy to VPS

on:
  push:
    branches:
      - main
      - master
  pull_request:
    branches:
      - main
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build project
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: npm run build

      - name: Deploy to VPS
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_SSH_KEY: ${{ secrets.VPS_SSH_KEY }}
          VPS_PORT: ${{ secrets.VPS_PORT }}
        run: |
          mkdir -p ~/.ssh
          echo "$VPS_SSH_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -p $VPS_PORT $VPS_HOST >> ~/.ssh/known_hosts
          
          # Copiar archivos build
          scp -P $VPS_PORT -i ~/.ssh/deploy_key -r dist/* $VPS_USER@$VPS_HOST:/var/www/inmobicasita/
          
          # Reiniciar servicios (si aplica)
          ssh -p $VPS_PORT -i ~/.ssh/deploy_key $VPS_USER@$VPS_HOST "sudo systemctl reload nginx"
```

---

## 🔐 Configurar GitHub Secrets

Para que el workflow funcione, necesitas configurar los secretos en GitHub:

### **Acceder a Secrets**

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Click en **New repository secret**

### **Secretos necesarios para VPS**

| Nombre | Valor | Ejemplo |
|--------|-------|---------|
| `VPS_HOST` | IP o dominio del VPS | `20.171.254.45` o `tu-dominio.com` |
| `VPS_USER` | Usuario SSH del VPS | `ubuntu` o `deploy` |
| `VPS_SSH_KEY` | Clave privada SSH (contenido completo) | `-----BEGIN RSA PRIVATE KEY-----...` |
| `VPS_PORT` | Puerto SSH (usualmente 22) | `22` |
| `VITE_API_URL` | URL de la API en producción | `http://20.171.254.45/api` |

### **Cómo obtener la clave SSH privada**

En tu VPS, ejecuta:

```bash
cat ~/.ssh/id_rsa
```

Copia TODO el contenido (incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`) y pégalo en el secret `VPS_SSH_KEY`.

---

## 🖥️ Despliegue en VPS con Nginx

### **Configuración en el VPS**

#### **1. Crear carpeta de despliegue**

```bash
sudo mkdir -p /var/www/inmobicasita
sudo chown $USER:$USER /var/www/inmobicasita
```

#### **2. Configurar Nginx**

Crea `/etc/nginx/sites-available/inmobicasita`:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    # Redirigir a HTTPS (opcional si tienes certificado SSL)
    # return 301 https://$server_name$request_uri;

    root /var/www/inmobicasita;
    index index.html;

    # Servir archivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Todas las rutas van a index.html (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy a la API (si está en el mismo VPS)
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### **3. Habilitar sitio y recargar Nginx**

```bash
sudo ln -s /etc/nginx/sites-available/inmobicasita /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### **4. Configurar SSL (con Certbot)**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

---

## 🚀 Despliegue en Netlify

### **Método 1: Conexión directa con GitHub**

1. Ve a [netlify.com](https://netlify.com)
2. Click en **"New site from Git"**
3. Selecciona **GitHub**
4. Autoriza Netlify
5. Selecciona tu repositorio
6. Configura:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. Click en **"Deploy site"**

### **Método 2: Usando netlify.toml**

Ya tienes el archivo `netlify.toml` en el proyecto. Asegúrate que tenga:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_URL = "http://20.171.254.45/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Configurar variables de entorno en Netlify**

1. En Netlify, ve a **Site settings** → **Build & deploy** → **Environment**
2. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `http://20.171.254.45/api`
3. Trigger deploy manual o push a `main`

---

## ⚡ Despliegue en Vercel

### **Método 1: Conexión directa con GitHub**

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio GitHub
4. Vercel auto-detecta Vite
5. Configura:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `http://20.171.254.45/api`
6. Click en **"Deploy"**

### **Archivo vercel.json**

Ya existe en el proyecto. Vercel lo usará automáticamente para rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

---

## 📊 Flujo CI/CD Explicado

### **Diagrama del proceso**

```
┌─────────────────┐
│  Push a main    │
│   en GitHub     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  GitHub Actions Triggered   │
│  (workflow: deploy.yml)     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  1. Checkout código         │
│  2. Setup Node.js 18        │
│  3. npm install             │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  npm run build              │
│  (genera carpeta dist/)     │
│  VITE_API_URL inyectado     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Build exitoso?             │
└────┬─────────────────────┬──┘
     │ NO                  │ YES
     ▼                     ▼
  FALLA             ┌──────────────────┐
  Build             │ Conectar VPS SSH │
                    │ (usando secrets) │
                    └────┬─────────────┘
                         │
                         ▼
                    ┌──────────────────┐
                    │  scp dist/* →    │
                    │ /var/www/..      │
                    └────┬─────────────┘
                         │
                         ▼
                    ┌──────────────────┐
                    │ systemctl reload │
                    │      nginx       │
                    └────┬─────────────┘
                         │
                         ▼
                    ┌──────────────────┐
                    │ ✅ Despliegue OK │
                    │ En vivo!         │
                    └──────────────────┘
```

### **Paso a Paso**

1. **Trigger**: Haces `git push` a rama `main`

2. **Checkout**: GitHub Actions descarga tu código

3. **Setup**: Instala Node.js 18 y dependencias

4. **Build**:
   - Ejecuta `npm run build`
   - Inyecta `VITE_API_URL` como variable de entorno
   - Genera carpeta `dist/` optimizada

5. **Deploy**:
   - Se conecta al VPS usando SSH
   - Copia archivos `dist/` a `/var/www/inmobicasita/`
   - Recarga Nginx

6. **Live**: Tu frontend está en producción

---

## ✅ Verificar Despliegue

### **En VPS**

```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log

# Verificar archivos desplegados
ls -la /var/www/inmobicasita/

# Verificar Nginx está corriendo
sudo systemctl status nginx
```

### **En GitHub**

1. Ve a tu repositorio
2. Click en **Actions**
3. Ve el workflow en proceso o completado
4. Click en el workflow para ver logs detallados

### **En navegador**

Abre `http://tu-dominio.com` (o IP del VPS) y verifica:
- ✅ Página carga correctamente
- ✅ React Router funciona (navega entre páginas)
- ✅ API calls funcionan (devTools → Network)
- ✅ Funcionalidad completa sin errores

---

## 🐛 Solucionar Problemas

### **Problema: Workflow falla en "Build project"**

```
Error: npm ERR! code ENOENT
```

**Solución**:
```bash
# En tu máquina local, verifica
npm install
npm run build
# Si funciona localmente, el problema es en GitHub Actions
```

### **Problema: Deploy falla en SSH**

```
Error: Permission denied (publickey)
```

**Solución**:
- Verifica que `VPS_SSH_KEY` esté completo (con BEGIN y END)
- Asegúrate de que la clave pública esté en `~/.ssh/authorized_keys` del VPS
- Verifica usuario y host sean correctos

### **Problema: Nginx devuelve 404**

```
404 Not Found
```

**Solución**:
- Verifica que `try_files $uri $uri/ /index.html;` esté en config Nginx
- Recarga Nginx: `sudo systemctl reload nginx`
- Verifica archivos en `/var/www/inmobicasita/`: `ls -la`

### **Problema: API calls devuelven error CORS**

```
Access to XMLHttpRequest has been blocked by CORS
```

**Solución**:
- Verifica `VITE_API_URL` es correcto en GitHub Secrets
- En Django API, configura CORS:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "https://tu-dominio.com",
      "http://localhost:3000"
  ]
  ```

---

## 📝 Archivo de Configuración Mínimo

### **.github/workflows/deploy.yml** (mínimo)

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
```

---

## 🎯 Próximos Pasos

1. **Configura GitHub Secrets** (ver tabla arriba)
2. **Haz push a main**: 
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```
3. **Monitorea en GitHub Actions** (Actions tab)
4. **Verifica despliegue en vivo**
5. **Si todo OK**: Tienes automatización completa 🚀

---

## 📚 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Netlify Deployment](https://docs.netlify.com/get-started/deployment-overview/)
- [Vercel Docs](https://vercel.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Nginx Configuration](https://nginx.org/en/docs/)

