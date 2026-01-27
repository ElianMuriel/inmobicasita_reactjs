# 🔑 Guía Paso a Paso: Configurar Claves SSH para CI/CD

## ✅ Paso 1: Claves Generadas

Las claves SSH ya fueron generadas en tu máquina local:
- **Clave privada**: `gh_actions_react` → Para GitHub Secret `VPS_KEY`
- **Clave pública**: `gh_actions_react.pub` → Para autorizar en el VPS

---

## 📋 Paso 2: Autorizar la Clave en el VPS

### 2.1 Conectarse al VPS

```bash
# Opción A: Usar tu usuario (RECOMENDADO - más seguro)
ssh elianadmin@IP_DEL_VPS

# Opción B: Usar root (más simple, pero menos seguro)
ssh root@IP_DEL_VPS
```

**Recomendación**: Usa `elianadmin` con sudo. Es más seguro y profesional.

### 2.2 Copiar la Clave Pública

**En tu máquina local**, copia el contenido de la clave pública:

```bash
# Windows (PowerShell)
type gh_actions_react.pub

# O abre el archivo con notepad
notepad gh_actions_react.pub
```

**Copia TODO el contenido** (debe empezar con `ssh-ed25519` y terminar con `gh-actions-react`)

### 2.3 Autorizar en el VPS

**En el VPS**, ejecuta:

#### Opción A: Usar tu usuario `elianadmin` (RECOMENDADO)

```bash
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Pega aquí el contenido de la clave pública
# Guarda con Ctrl+O, Enter, Ctrl+X

chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

#### Opción B: Usar root (más simple, menos seguro)

```bash
sudo mkdir -p /root/.ssh
sudo nano /root/.ssh/authorized_keys
# Pega aquí el contenido de la clave pública
# Guarda con Ctrl+O, Enter, Ctrl+X

sudo chmod 700 /root/.ssh
sudo chmod 600 /root/.ssh/authorized_keys
```

### 2.4 Probar la Conexión

**En tu máquina local**, prueba la conexión:

```bash
# Si usas elianadmin (RECOMENDADO)
ssh -i gh_actions_react elianadmin@IP_DEL_VPS

# Si usas root
ssh -i gh_actions_react root@IP_DEL_VPS
```

Si funciona (te conecta sin pedir contraseña), ¡perfecto! Continúa.

---

## 🔐 Paso 3: Configurar Secrets en GitHub

### 3.1 Ir a GitHub Secrets

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/inmobicasita_reactjs`
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **"New repository secret"**

### 3.2 Crear los 4 Secrets

#### Secret 1: `VPS_HOST`
- **Name**: `VPS_HOST`
- **Secret**: `inmobi-casita.desarrollo-software.xyz` (o la IP de tu VPS)
- **Add secret**

#### Secret 2: `VPS_USER`
- **Name**: `VPS_USER`
- **Secret**: `elianadmin` (si usas tu usuario) o `root` (si usas root)
- **Add secret**

#### Secret 3: `VPS_KEY`
- **Name**: `VPS_KEY`
- **Secret**: Copia **TODO** el contenido de la clave privada

**En tu máquina local:**
```bash
# Windows (PowerShell)
type gh_actions_react
```

**Copia TODO**, incluyendo:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

- **Add secret**

#### Secret 4: `REACT_ENV`
- **Name**: `REACT_ENV`
- **Secret**: 
  ```
  VITE_API_URL=http://20.171.254.45/api
  ```
- **Add secret**

---

## ✅ Paso 4: Verificar que Todo Está Listo

### Checklist:

- [ ] Claves SSH generadas (`gh_actions_react` y `gh_actions_react.pub`)
- [ ] Clave pública autorizada en el VPS (`/root/.ssh/authorized_keys` o `~/.ssh/authorized_keys`)
- [ ] Conexión SSH probada y funciona
- [ ] 4 Secrets creados en GitHub:
  - [ ] `VPS_HOST`
  - [ ] `VPS_USER`
  - [ ] `VPS_KEY`
  - [ ] `REACT_ENV`
- [ ] Repositorio creado en GitHub
- [ ] Repositorio local conectado a GitHub

---

## 🚀 Paso 5: Hacer el Primer Push

Una vez que todo esté configurado:

```bash
# Verificar que el remote está configurado
git remote -v

# Si no está configurado, agrega el remote:
git remote add origin https://github.com/TU_USUARIO/inmobicasita_reactjs.git
git branch -M main

# Hacer push
git push -u origin main
```

Luego ve a GitHub → **Actions** y observa el workflow ejecutándose.

---

## 🔍 Troubleshooting

### Error: "Permission denied (publickey)"

1. Verifica que la clave pública esté en `authorized_keys`:
   ```bash
   # En el VPS
   cat ~/.ssh/authorized_keys
   # O si usas root:
   sudo cat /root/.ssh/authorized_keys
   ```

2. Verifica los permisos:
   ```bash
   # En el VPS
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

3. Verifica que estés usando la clave correcta:
   ```bash
   # En tu máquina local
   ssh -i gh_actions_react -v root@IP_DEL_VPS
   ```

### Error: "Host key verification failed"

```bash
# En el VPS, agregar GitHub a known_hosts
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
```

### Error en GitHub Actions: "Connection refused"

- Verifica que `VPS_HOST` tenga la IP o dominio correcto
- Verifica que el VPS esté accesible desde internet
- Verifica que el puerto 22 (SSH) esté abierto en el firewall

---

## 📝 Notas Importantes

1. **Nunca compartas la clave privada** (`gh_actions_react`) públicamente
2. **La clave privada va en GitHub Secrets**, no en el código
3. **La clave pública va en el VPS** (`authorized_keys`)
4. **Guarda las claves en un lugar seguro** (puedes hacer backup)

---

## 🎉 ¡Listo!

Una vez completados estos pasos, cada `git push` a `main` desplegará automáticamente tu aplicación en el VPS.
