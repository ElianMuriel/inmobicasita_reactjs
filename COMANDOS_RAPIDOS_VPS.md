# 🚀 Comandos Rápidos para Despliegue en VPS

## 📋 Checklist de Configuración

### 1. En tu máquina local - Generar clave SSH

```bash
ssh-keygen -t ed25519 -C "gh-actions-react" -f gh_actions_react
cat gh_actions_react.pub  # Copia esto para el VPS
cat gh_actions_react      # Copia esto para GitHub Secret VPS_KEY
```

### 2. En el VPS - Configuración inicial

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Nginx
sudo apt install -y nginx

# Crear directorio
sudo mkdir -p /var/www/react-app
sudo chown -R $USER:$USER /var/www/react-app

# Autorizar clave SSH (si usas root)
sudo mkdir -p /root/.ssh
sudo nano /root/.ssh/authorized_keys
# Pega aquí el contenido de gh_actions_react.pub

sudo chmod 700 /root/.ssh
sudo chmod 600 /root/.ssh/authorized_keys
```

### 3. En el VPS - Configurar Nginx

```bash
# Crear configuración
sudo nano /etc/nginx/sites-available/react-app
```

Pega esta configuración (ajusta `server_name` si tienes dominio):

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

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/react-app

# Verificar y recargar
sudo nginx -t
sudo systemctl reload nginx

# Firewall (opcional)
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

### 4. En GitHub - Configurar Secrets

Ve a: **Settings → Secrets and variables → Actions → New repository secret**

Crea estos 4 secrets:

1. **VPS_HOST**: `inmobi-casita.desarrollo-software.xyz` (o la IP del VPS)
2. **VPS_USER**: `root` (o tu usuario)
3. **VPS_KEY**: Contenido completo de `gh_actions_react` (clave privada)
4. **REACT_ENV**: 
   ```
   VITE_API_URL=http://20.171.254.45/api
   ```
   (O usa HTTPS si tu API tiene certificado SSL)

### 5. Probar conexión SSH desde tu máquina local

```bash
ssh -i gh_actions_react root@TU_IP_VPS
```

Si funciona, puedes continuar.

### 6. Hacer el primer despliegue

```bash
# En tu máquina local
git add .
git commit -m "Configurar CI/CD"
git push origin main
```

Luego ve a GitHub → Actions y observa el workflow ejecutándose.

---

## 🔍 Comandos de Verificación

### Verificar que Nginx está corriendo
```bash
sudo systemctl status nginx
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Verificar que los archivos están en el lugar correcto
```bash
ls -la /var/www/react-app
```

### Probar el sitio
```bash
curl -I http://TU_IP
```

### Verificar permisos
```bash
sudo chown -R www-data:www-data /var/www/react-app
sudo chmod -R 755 /var/www/react-app
```

---

## 🔒 HTTPS con Let's Encrypt (Opcional)

Configurar HTTPS con Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d inmobi-casita.desarrollo-software.xyz
```

Después de esto, tu sitio estará disponible en `https://inmobi-casita.desarrollo-software.xyz`

---

## ⚠️ Troubleshooting Rápido

### Error: Permission denied
```bash
sudo chown -R www-data:www-data /var/www/react-app
```

### Error: Puerto 80 ocupado
```bash
sudo lsof -i :80
sudo systemctl stop apache2  # Si está corriendo
```

### Error: Nginx no inicia
```bash
sudo nginx -t  # Verifica la configuración
```

### El sitio muestra página en blanco
```bash
# Verifica que index.html existe
ls -la /var/www/react-app/index.html

# Verifica permisos
sudo chmod 644 /var/www/react-app/index.html
```

---

## ✅ Verificación Final

1. ✅ Nginx corriendo: `sudo systemctl status nginx`
2. ✅ Archivos en lugar: `ls /var/www/react-app`
3. ✅ Sitio accesible: `curl http://TU_IP`
4. ✅ GitHub Actions ejecutándose sin errores

¡Listo! 🎉
