# 📦 Crear Repositorio en GitHub y Configurar

## Paso 1: Crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en el botón **"+"** (arriba a la derecha) → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `inmobicasita_reactjs` (o el nombre que prefieras)
   - **Description**: `Frontend React para InmobiCasita - Inmobiliaria`
   - **Visibility**: 
     - ✅ **Private** (recomendado para proyectos escolares)
     - O **Public** si prefieres
   - ❌ **NO marques** "Add a README file" (ya tienes archivos)
   - ❌ **NO marques** "Add .gitignore" (ya tienes uno)
   - ❌ **NO marques** "Choose a license"
4. Haz clic en **"Create repository"**

## Paso 2: Conectar tu repositorio local con GitHub

Después de crear el repositorio, GitHub te mostrará instrucciones. Ejecuta estos comandos en tu terminal:

### Si usas HTTPS (más fácil):

```bash
git remote add origin https://github.com/TU_USUARIO/inmobicasita_reactjs.git
git branch -M main
git push -u origin main
```

**Reemplaza `TU_USUARIO`** con tu nombre de usuario de GitHub.

### Si usas SSH (más seguro, requiere clave SSH configurada):

```bash
git remote add origin git@github.com:TU_USUARIO/inmobicasita_reactjs.git
git branch -M main
git push -u origin main
```

## Paso 3: Verificar

Ve a tu repositorio en GitHub y verifica que todos los archivos estén ahí.

## ⚠️ Si te pide autenticación

### Para HTTPS:
- GitHub ya no acepta contraseñas
- Usa un **Personal Access Token (PAT)**:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. Generate new token (classic)
  3. Selecciona scopes: `repo` (todos los permisos de repositorio)
  4. Copia el token
  5. Úsalo como contraseña cuando Git te lo pida

### Para SSH:
- Necesitas tener una clave SSH configurada en GitHub
- Si no la tienes, sigue las instrucciones de GitHub para generarla

---

## 🚀 Después de hacer push

Una vez que el repositorio esté en GitHub, puedes:

1. **Configurar los Secrets** para CI/CD (ver `DESPLIEGUE_VPS.md`)
2. **Hacer cambios y push** - GitHub Actions se ejecutará automáticamente
3. **Configurar el VPS** para recibir los despliegues

---

## 📝 Comandos Rápidos

```bash
# Ver el remote configurado
git remote -v

# Cambiar el remote (si te equivocaste)
git remote set-url origin https://github.com/TU_USUARIO/inmobicasita_reactjs.git

# Hacer push de cambios futuros
git add .
git commit -m "Descripción del cambio"
git push origin main
```
