# 🔐 Configuración con Usuario elianadmin (Recomendado)

Esta guía te muestra cómo configurar todo usando tu usuario `elianadmin` en lugar de `root`. Es más seguro y profesional.

---

## ✅ Ventajas de usar elianadmin

- ✅ Más seguro (no usar root directamente)
- ✅ Mejor práctica en producción
- ✅ Permisos más controlados
- ✅ Logs más claros

---

## 🔑 Paso 1: Autorizar Clave SSH en el VPS

### 1.1 Conectarse al VPS

```bash
ssh elianadmin@IP_DEL_VPS
```

### 1.2 Autorizar la Clave Pública

```bash
# Crear directorio .ssh si no existe
mkdir -p ~/.ssh

# Agregar la clave pública
nano ~/.ssh/authorized_keys
```

**Pega esta línea** (la clave pública que generamos):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEJN/EkqB27KPC+frZ7wjeMRije4NUCDEDhOQxZ9XdtR gh-actions-react
```

**Guardar**: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Ajustar permisos (MUY IMPORTANTE)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 1.3 Probar Conexión

**En tu máquina local:**

```bash
ssh -i gh_actions_react elianadmin@IP_DEL_VPS
```

Si funciona, continúa.

---

## ⚙️ Paso 2: Configurar Nginx (con sudo)

### 2.1 Instalar Nginx

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx
```

### 2.2 Crear Directorio del Sitio

```bash
sudo mkdir -p /var/www/react-app
sudo chown -R elianadmin:elianadmin /var/www/react-app
```

### 2.3 Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/react-app
```

**Pega esta configuración** (ya tiene tu dominio configurado):

```nginx
server {
    listen 80;
    server_name inmobi-casita.desarrollo-software.xyz;

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

**Guardar**: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/react-app

# Verificar configuración
sudo nginx -t

# Recargar Nginx
sudo systemctl reload nginx
```

### 2.4 Configurar Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status
```

---

## 🔐 Paso 3: Configurar GitHub Secrets

Ve a GitHub → Settings → Secrets and variables → Actions

### Secret 1: `VPS_HOST`
```
inmobi-casita.desarrollo-software.xyz
```

### Secret 2: `VPS_USER`
```
elianadmin
```

### Secret 3: `VPS_KEY`
Copia TODO el contenido de `gh_actions_react` (la clave privada):
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBCTfxJKgduyjwvn62e8I3jEYo3uDVAgxA4TkMWfV3bUQAAAJjndMfm53TH
5gAAAAtzc2gtZWQyNTUxOQAAACBCTfxJKgduyjwvn62e8I3jEYo3uDVAgxA4TkMWfV3bUQ
AAAECq5hvUieChXV5IzdSHQklUga/FXnIcOVKrmo8X4F3onEJN/EkqB27KPC+frZ7wjeMR
ije4NUCDEDhOQxZ9XdtRAAAAEGdoLWFjdGlvbnMtcmVhY3QBAgMEBQ==
-----END OPENSSH PRIVATE KEY-----
```

### Secret 4: `REACT_ENV`
```
VITE_API_URL=http://20.171.254.45/api
```

---

## 🔧 Paso 4: Ajustar Permisos para GitHub Actions

Como usas `elianadmin` (no root), GitHub Actions necesita permisos para:
- Escribir en `/var/www/react-app`
- Ejecutar `sudo nginx -t` y `sudo systemctl reload nginx`

### Opción A: Configurar sudo sin contraseña (Recomendado)

**En el VPS:**

```bash
sudo visudo
```

Agrega estas líneas al final del archivo:

```
# Permitir a elianadmin ejecutar comandos de Nginx sin contraseña
elianadmin ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
elianadmin ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
elianadmin ALL=(ALL) NOPASSWD: /bin/systemctl status nginx
```

**Guardar**: `Ctrl+O`, `Enter`, `Ctrl+X`

### Opción B: Dar permisos de escritura al directorio

```bash
# Dar permisos a elianadmin para escribir en /var/www/react-app
sudo chown -R elianadmin:elianadmin /var/www/react-app
sudo chmod -R 755 /var/www/react-app
```

---

## 🔄 Paso 5: Actualizar el Workflow (si es necesario)

El workflow actual debería funcionar, pero si hay problemas de permisos, podemos ajustarlo.

**Verifica que el workflow tenga estos comandos:**

```yaml
script: |
  set -e
  
  mkdir -p /var/www/react-app
  rm -rf /var/www/react-app/*
  cp -r /tmp/react_build/* /var/www/react-app/
  
  chown -R elianadmin:elianadmin /var/www/react-app
  chmod -R 755 /var/www/react-app
  
  sudo nginx -t
  sudo systemctl reload nginx
```

---

## ✅ Paso 6: Probar el Despliegue

```bash
# En tu máquina local
git push origin main
```

Luego ve a GitHub → **Actions** y observa el workflow.

---

## 🔍 Troubleshooting

### Error: "Permission denied" al copiar archivos

```bash
# En el VPS
sudo chown -R elianadmin:elianadmin /var/www/react-app
sudo chmod -R 755 /var/www/react-app
```

### Error: "sudo: a password is required"

Configura sudo sin contraseña (ver Paso 4, Opción A).

### Error: "nginx: command not found"

```bash
# Verificar que Nginx esté instalado
which nginx
# Debería mostrar: /usr/sbin/nginx
```

---

## 📝 Resumen de Configuración

- **Usuario**: `elianadmin`
- **Directorio**: `/var/www/react-app`
- **Permisos**: `elianadmin:elianadmin` con `755`
- **Nginx**: Configurado con sudo sin contraseña
- **GitHub Secret VPS_USER**: `elianadmin`

¡Listo! 🎉
