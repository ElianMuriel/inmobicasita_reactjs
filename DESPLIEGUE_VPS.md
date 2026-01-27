# 🚀 Guía de Despliegue: React (Vite) en VPS Ubuntu 24.04 con Nginx + CI/CD

Esta guía te ayudará a desplegar tu aplicación React (InmobiCasita) en un VPS Ubuntu 24.04 usando Nginx y automatizar los despliegues con GitHub Actions.

## 📋 Requisitos Previos

- VPS Ubuntu 24.04 con acceso SSH
- Dominio: `inmobi-casita.desarrollo-software.xyz` (ya configurado)
- Repositorio en GitHub (puede ser privado)
- Acceso root o usuario con permisos sudo

---

## 🔧 Parte 1: Configuración Inicial del VPS

### 1.1 Conectarse al VPS

```bash
ssh usuario@IP_DEL_VPS
```

### 1.2 Actualizar el sistema e instalar herramientas

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx
```

### 1.3 Instalar Node.js (opcional - solo si construirás en el VPS)

Si vas a construir en el VPS (no recomendado, mejor en GitHub Actions):

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 1.4 Crear directorio del sitio

```bash
sudo mkdir -p /var/www/react-app
sudo chown -R $USER:$USER /var/www/react-app
```

---

## 🔑 Parte 2: Configurar Acceso SSH para GitHub Actions

### 2.1 Generar clave SSH en tu máquina local

En tu máquina local (NO en el VPS):

```bash
ssh-keygen -t ed25519 -C "gh-actions-react" -f gh_actions_react
```

Esto creará dos archivos:
- `gh_actions_react` (clave privada) - **NO la compartas**
- `gh_actions_react.pub` (clave pública)

### 2.2 Autorizar la clave en el VPS

**Opción A: Si usas root (recomendado para laboratorio)**

```bash
# En el VPS
sudo mkdir -p /root/.ssh
sudo nano /root/.ssh/authorized_keys
```

Pega el contenido de la clave pública:

```bash
# En tu máquina local
cat gh_actions_react.pub
```

Luego en el VPS, pega ese contenido en `/root/.ssh/authorized_keys` y guarda.

```bash
# En el VPS - ajustar permisos
sudo chmod 700 /root/.ssh
sudo chmod 600 /root/.ssh/authorized_keys
```

**Opción B: Si usas un usuario normal (más seguro en producción)**

```bash
# En el VPS
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Pega la clave pública aquí
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 2.3 Probar conexión SSH

En tu máquina local:

```bash
# Si usas root
ssh -i gh_actions_react root@IP_DEL_VPS

# Si usas usuario normal
ssh -i gh_actions_react usuario@IP_DEL_VPS
```

Si funciona, puedes continuar.

---

## 🔐 Parte 3: Configurar Secrets en GitHub

### 3.1 Ir a GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Haz clic en "New repository secret"

### 3.2 Crear los siguientes secrets:

#### `VPS_HOST`
- Valor: `inmobi-casita.desarrollo-software.xyz` (o la IP de tu VPS)

#### `VPS_USER`
- Valor: `root` (o el usuario que configuraste)

#### `VPS_KEY`
- Valor: El contenido completo de la clave **privada** `gh_actions_react`
  ```bash
  cat gh_actions_react
  ```
  Copia TODO el contenido, incluyendo `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----`

#### `REACT_ENV`
- Valor: El contenido de tu archivo `.env.production`
  ```
  VITE_API_URL=http://20.171.254.45/api
  ```
  O si tu API tiene un subdominio HTTPS:
  ```
  VITE_API_URL=https://api.desarrollo-software.xyz/api
  ```

---

## ⚙️ Parte 4: Configurar Nginx

### 4.1 Crear configuración de Nginx

En el VPS:

```bash
sudo nano /etc/nginx/sites-available/react-app
```

Copia el contenido del archivo `nginx-react-app.conf` que está en el repositorio. El dominio ya está configurado como `inmobi-casita.desarrollo-software.xyz`.

Si no tienes dominio, puedes usar:

```nginx
server {
    listen 80;
    server_name _;  # Acepta cualquier dominio/IP

    root /var/www/react-app;
    index index.html;

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header Referrer-Policy strict-origin-when-cross-origin;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
        try_files $uri =404;
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

### 4.2 Habilitar el sitio

```bash
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/react-app
```

### 4.3 Verificar y recargar Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4.4 Configurar firewall (opcional pero recomendado)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## 🔒 Parte 5: Configurar HTTPS con Let's Encrypt (Opcional pero Recomendado)

**Configurar HTTPS con Let's Encrypt:**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d inmobi-casita.desarrollo-software.xyz
```

Certbot configurará SSL automáticamente y renovará los certificados. Después de esto, tu sitio estará disponible en `https://inmobi-casita.desarrollo-software.xyz`.

Certbot configurará SSL automáticamente y renovará los certificados.

---

## 🚀 Parte 6: Primer Despliegue Manual (Opcional - para probar)

Si quieres probar antes de configurar CI/CD:

### 6.1 Clonar el repositorio (si es privado, necesitas Deploy Key)

```bash
# Generar Deploy Key en el VPS
ssh-keygen -t ed25519 -C "github-deploy-react" -f ~/.ssh/github_deploy_react

# Ver la clave pública
cat ~/.ssh/github_deploy_react.pub
```

Agrega esta clave en GitHub: Settings → Deploy Keys → Add deploy key

```bash
# Configurar GitHub como host confiable
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
chmod 644 ~/.ssh/known_hosts

# Clonar (ajusta la URL)
GIT_SSH_COMMAND='ssh -i ~/.ssh/github_deploy_react -o IdentitiesOnly=yes' \
git clone git@github.com:TU_USUARIO/TU_REPO.git /tmp/react-app

cd /tmp/react-app

# Crear .env.production
nano .env.production
# Agrega: VITE_API_URL=http://20.171.254.45/api
# (O usa HTTPS si tu API tiene certificado SSL)

# Construir
npm install
npm run build

# Copiar al directorio de Nginx
sudo cp -r dist/* /var/www/react-app/
sudo chown -R www-data:www-data /var/www/react-app
sudo chmod -R 755 /var/www/react-app
```

---

## 🤖 Parte 7: CI/CD Automático con GitHub Actions

### 7.1 El workflow ya está creado

El archivo `.github/workflows/deploy.yml` ya está en el repositorio y se ejecutará automáticamente cuando hagas push a `main` o `master`.

### 7.2 Hacer el primer despliegue

```bash
# En tu máquina local
git add .
git commit -m "Configurar CI/CD para despliegue automático"
git push origin main
```

### 7.3 Verificar el despliegue

1. Ve a la pestaña **Actions** en GitHub
2. Verás el workflow ejecutándose
3. Si hay errores, revisa los logs

### 7.4 Probar el sitio

```bash
# En el VPS o desde tu navegador
curl -I http://inmobi-casita.desarrollo-software.xyz
```

O abre en tu navegador: `http://inmobi-casita.desarrollo-software.xyz`

**Después de configurar HTTPS:**
```bash
curl -I https://inmobi-casita.desarrollo-software.xyz
```

O abre: `https://inmobi-casita.desarrollo-software.xyz`

---

## 🔍 Troubleshooting

### Error: "Permission denied" al copiar archivos

```bash
# Asegúrate de que el directorio tenga los permisos correctos
sudo chown -R www-data:www-data /var/www/react-app
sudo chmod -R 755 /var/www/react-app
```

### Error: "nginx: [emerg] bind() to 0.0.0.0:80 failed"

```bash
# Verifica qué está usando el puerto 80
sudo lsof -i :80
# O detén Apache si está corriendo
sudo systemctl stop apache2
```

### Error: "Host key verification failed" en GitHub Actions

Asegúrate de que la clave SSH esté correctamente configurada en los Secrets.

### El sitio muestra "502 Bad Gateway"

```bash
# Verifica que Nginx esté corriendo
sudo systemctl status nginx

# Verifica los logs
sudo tail -f /var/log/nginx/error.log
```

### Variables de entorno no funcionan

Recuerda que en Vite, las variables deben empezar con `VITE_` y se inyectan en **build-time**, no en runtime.

---

## 📝 Notas Importantes

1. **Variables de entorno**: En React/Vite, las variables se inyectan durante el build. Si cambias variables, debes hacer un nuevo build.

2. **API URL**: Asegúrate de que la URL de la API en `REACT_ENV` sea accesible desde el navegador del usuario (no desde el servidor).

3. **CORS**: Si tu API está en otro dominio, asegúrate de configurar CORS correctamente en el backend.

4. **HTTPS**: En producción, siempre usa HTTPS. Let's Encrypt es gratuito.

5. **Backup**: Considera hacer backups del directorio `/var/www/react-app` antes de cada despliegue.

---

## ✅ Checklist Final

- [ ] VPS configurado con Nginx
- [ ] Clave SSH generada y autorizada en el VPS
- [ ] Secrets configurados en GitHub
- [ ] Nginx configurado y funcionando
- [ ] Firewall configurado (opcional)
- [ ] HTTPS configurado (opcional pero recomendado)
- [ ] Primer despliegue exitoso
- [ ] CI/CD funcionando automáticamente

---

## 🎉 ¡Listo!

Ahora cada vez que hagas `git push` a la rama `main`, GitHub Actions:
1. Compilará tu aplicación React
2. Subirá el build al VPS
3. Lo activará en Nginx
4. Recargará Nginx automáticamente

¡Tu aplicación estará siempre actualizada! 🚀
