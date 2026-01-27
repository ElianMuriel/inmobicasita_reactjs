# Plan de Sincronización

## ✅ Cambios en la VM (sin commitear)
Los cambios que tienes en la VM son **exactamente los mismos** que acabo de hacer en local:
- ✅ Campo `user` en Cliente (models.py)
- ✅ `user_id` y `username` en ClienteSerializer
- ✅ `get_queryset()` en InmuebleViewSet
- ✅ Funciones `ProfileView`, `mi_cliente`, `register`
- ✅ Rutas nuevas en urls.py
- ✅ Cambios en settings.py (ruta .env, nombres de variables)

## 📋 Plan de Acción

### Paso 1: Ver qué hay en los 6 commits de GitHub
```bash
# En la VM
git log HEAD..origin/main --oneline
git diff HEAD..origin/main --stat
```

### Paso 2: Hacer commit de cambios locales
```bash
# Agregar archivos (sin los backups)
git add gestion/models.py gestion/views.py gestion/serializers.py gestion/urls.py inmobicasita_api/settings.py

# Commit
git commit -m "Agregar relación User-Cliente, endpoints y mejoras para frontend"
```

### Paso 3: Hacer pull (puede haber conflictos)
```bash
git pull origin main
```

**Si hay conflictos:**
- Probablemente en `settings.py` (por los cambios de configuración)
- Los resolveremos juntos

### Paso 4: Resolver conflictos (si los hay)
- Editar archivos con conflictos
- Quitar marcadores `<<<<<<<`, `=======`, `>>>>>>>`
- Mantener los cambios correctos

### Paso 5: Hacer push
```bash
git push origin main
```

### Paso 6: En local, hacer pull
```powershell
cd C:\proyectos\InmobiCasita_backend
git pull
```

---

**Nota**: Como los cambios son idénticos, probablemente solo haya conflictos en settings.py si los 6 commits también modificaron ese archivo.
