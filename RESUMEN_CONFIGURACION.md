# 📋 Resumen de Configuración - Usuario elianadmin

## ✅ Decisión: Usar `elianadmin` (Recomendado)

**Ventajas:**
- ✅ Más seguro (no usar root)
- ✅ Mejor práctica
- ✅ Ya tienes el usuario configurado

---

## 🔑 Paso 1: Autorizar Clave en el VPS

**En el VPS:**

```bash
ssh elianadmin@IP_DEL_VPS

mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

**Pega esta línea:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEJN/EkqB27KPC+frZ7wjeMRije4NUCDEDhOQxZ9XdtR gh-actions-react
```

**Guardar y ajustar permisos:**
```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

**Probar desde tu máquina local:**
```bash
ssh -i gh_actions_react elianadmin@IP_DEL_VPS
```

---

## ⚙️ Paso 2: Configurar Sudo sin Contraseña (IMPORTANTE)

GitHub Actions necesita ejecutar `sudo nginx -t` y `sudo systemctl reload nginx` sin contraseña.

**En el VPS:**

```bash
sudo visudo
```

**Agrega estas líneas al final:**
```
# Permitir a elianadmin ejecutar comandos de Nginx sin contraseña
elianadmin ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
elianadmin ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
elianadmin ALL=(ALL) NOPASSWD: /bin/systemctl status nginx
```

**Guardar**: `Ctrl+O`, `Enter`, `Ctrl+X`

**Probar:**
```bash
sudo nginx -t
# Debe funcionar sin pedir contraseña
```

---

## 🔐 Paso 3: Configurar GitHub Secrets

Ve a: **GitHub → Settings → Secrets and variables → Actions**

### Secret 1: `VPS_HOST`
```
inmobi-casita.desarrollo-software.xyz
```

### Secret 2: `VPS_USER`
```
elianadmin
```

### Secret 3: `VPS_KEY`
Copia TODO el contenido de `gh_actions_react`:
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

## 🚀 Paso 4: Configurar Nginx (si aún no lo has hecho)

**En el VPS:**

```bash
# Instalar Nginx
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx

# Crear directorio
sudo mkdir -p /var/www/react-app
sudo chown -R elianadmin:elianadmin /var/www/react-app

# Configurar Nginx
sudo nano /etc/nginx/sites-available/react-app
```

**Pega la configuración** (ya tiene tu dominio):
```nginx
server {
    listen 80;
    server_name inmobi-casita.desarrollo-software.xyz;

    root /var/www/react-app;
    index index.html;

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$ {
        expires 7d;
        add_header Cache-Control "public, max-age=604800, immutable";
    }

    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Habilitar y recargar:**
```bash
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/react-app
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Checklist Final

- [ ] Clave pública autorizada en `~/.ssh/authorized_keys` (usuario elianadmin)
- [ ] Permisos correctos: `chmod 700 ~/.ssh` y `chmod 600 ~/.ssh/authorized_keys`
- [ ] Conexión SSH probada: `ssh -i gh_actions_react elianadmin@IP`
- [ ] Sudo sin contraseña configurado para comandos de Nginx
- [ ] Nginx instalado y configurado
- [ ] Directorio `/var/www/react-app` creado con permisos para elianadmin
- [ ] 4 Secrets configurados en GitHub:
  - [ ] `VPS_HOST`: `inmobi-casita.desarrollo-software.xyz`
  - [ ] `VPS_USER`: `elianadmin`
  - [ ] `VPS_KEY`: (clave privada completa)
  - [ ] `REACT_ENV`: `VITE_API_URL=http://20.171.254.45/api`
- [ ] Repositorio creado en GitHub
- [ ] Repositorio local conectado a GitHub

---

## 🎯 Siguiente Paso

Una vez completado el checklist:

```bash
git push origin main
```

Y ve a GitHub → **Actions** para ver el despliegue automático.

---

## 📚 Documentación Adicional

- `CONFIGURACION_ELIANADMIN.md` - Guía detallada con elianadmin
- `PASOS_CLAVES_SSH.md` - Guía paso a paso de las claves
- `DESPLIEGUE_VPS.md` - Guía completa de despliegue
