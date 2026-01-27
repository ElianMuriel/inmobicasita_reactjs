# Estrategia de Sincronización VM ↔ GitHub ↔ Local

## 📊 Situación Actual

- **VM**: Tiene cambios locales sin commitear + está 6 commits detrás de GitHub
- **GitHub**: Tiene 6 commits que la VM no tiene
- **Local**: Tiene los cambios que acabo de hacer

## 🎯 Estrategia Recomendada

### Paso 1: Ver cambios locales en la VM

```bash
# En la VM
cd /opt/inmobicasita

# Ver qué cambió en cada archivo
git diff gestion/models.py
git diff gestion/views.py
git diff gestion/serializers.py
git diff gestion/urls.py
git diff inmobicasita_api/settings.py
```

### Paso 2: Hacer commit de cambios locales en la VM

```bash
# Agregar solo los archivos importantes (no los backups)
git add gestion/models.py gestion/views.py gestion/serializers.py gestion/urls.py inmobicasita_api/settings.py

# Hacer commit
git commit -m "Cambios desde VM - relación User-Cliente y mejoras"

# Ver estado
git status
```

### Paso 3: Hacer pull (puede haber conflictos)

```bash
git pull origin main
```

**Si hay conflictos:**
- Git te dirá qué archivos tienen conflictos
- Los resolveremos juntos

### Paso 4: Resolver conflictos (si los hay)

Si hay conflictos, Git marcará los archivos con `<<<<<<<`, `=======`, `>>>>>>>`

**Opciones:**
1. **Resolver manualmente** - Editar los archivos y quitar los marcadores
2. **Aceptar cambios de la VM** - `git checkout --ours archivo.py`
3. **Aceptar cambios de GitHub** - `git checkout --theirs archivo.py`

### Paso 5: Hacer push

```bash
git push origin main
```

### Paso 6: En local, hacer pull

```powershell
cd C:\proyectos\InmobiCasita_backend
git pull
```

Luego aplico los cambios que hice (si no están ya incluidos).

---

## ⚠️ Alternativa: Si hay muchos conflictos

Si prefieres una estrategia más segura:

1. **Hacer backup completo de la VM:**
```bash
cd /opt/inmobicasita
tar -czf /tmp/backup_vm_$(date +%Y%m%d).tar.gz gestion/ inmobicasita_api/
```

2. **Hacer pull y ver conflictos:**
```bash
git pull origin main
```

3. **Si hay conflictos, restaurar y hacer merge manual:**
```bash
# Ver conflictos
git status

# Resolver uno por uno
```

---

## 🔍 Ver qué hay en los 6 commits de GitHub

Para saber qué cambios hay en GitHub que no tienes:

```bash
# En la VM
git log HEAD..origin/main --oneline

# Ver cambios específicos
git diff HEAD..origin/main --stat
```

---

**Recomendación**: Empieza por ver los cambios locales con `git diff` y luego decidimos la mejor estrategia.
