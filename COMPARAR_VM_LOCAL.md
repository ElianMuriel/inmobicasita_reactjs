# Comparar y Sincronizar VM con Local

## 🔍 Opción 1: Hacer Push desde la VM (Recomendado)

Si tu VM tiene git configurado y está conectada al repositorio:

```bash
# En la VM
cd /opt/inmobicasita

# Ver estado
git status

# Ver qué archivos han cambiado
git diff

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "Cambios desde VM - relación User-Cliente y mejoras"

# Hacer push
git push
```

Luego en local:
```powershell
cd C:\proyectos\InmobiCasita_backend
git pull
```

## 🔍 Opción 2: Comparar Archivos Manualmente

Si prefieres comparar antes de hacer push, puedes:

### En la VM - Ver archivos modificados:
```bash
cd /opt/inmobicasita
git status
git diff gestion/models.py
git diff gestion/views.py
git diff gestion/serializers.py
git diff gestion/urls.py
```

### Copiar archivos específicos de la VM a local:

1. **Desde la VM, copiar contenido:**
```bash
cat gestion/models.py > /tmp/models_vm.txt
cat gestion/views.py > /tmp/views_vm.txt
cat gestion/serializers.py > /tmp/serializers_vm.txt
cat gestion/urls.py > /tmp/urls_vm.txt
```

2. **Luego copiar esos archivos a tu máquina local** (usando SCP o copiando el contenido)

## 🔍 Opción 3: Ver Diferencias Específicas

Si quieres ver qué tiene la VM que no tiene local:

```bash
# En la VM
cd /opt/inmobicasita
git diff HEAD gestion/models.py | head -50
git diff HEAD gestion/views.py | head -50
```

---

**Recomendación**: Si la VM tiene los cambios más recientes, haz push desde la VM primero, luego haz pull en local y aplica los cambios que hice.
