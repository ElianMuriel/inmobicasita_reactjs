# Cambios para Vendedor - Backend

## Problema Actual
1. La detección de vendedor se basa en tener inmuebles (`Inmueble.objects.filter(usuario=user).exists()`)
2. El usuario quiere asignar vendedores desde admin sin necesidad de que tengan inmuebles
3. El dashboard muestra todos los inmuebles (3) pero la lista solo muestra 1

## Solución: Usar Django Groups

### 1. Modificar `CustomTokenObtainPairSerializer` en `gestion/views.py`

**Buscar esta clase en `gestion/views.py`** (debe estar cerca del inicio del archivo):

```python
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        try:
            token['username'] = str(user.username)
            token['is_staff'] = bool(user.is_staff)
            token['user_id'] = int(user.id)
            token['is_vendedor'] = bool(Inmueble.objects.filter(usuario=user).exists())  # ← CAMBIAR ESTA LÍNEA
            
            try:
                cliente_profile = Cliente.objects.get(user=user)
                token['is_cliente'] = True
                token['cliente_id'] = int(cliente_profile.id)
            except Cliente.DoesNotExist:
                token['is_cliente'] = False
                token['cliente_id'] = None
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error adding custom claims for user {user.username}: {e}")
            token['is_vendedor'] = False
            token['is_cliente'] = False
            token['cliente_id'] = None
        return token
```

**Reemplazar la línea que detecta vendedor:**

**DE:**
```python
token['is_vendedor'] = bool(Inmueble.objects.filter(usuario=user).exists())
```

**A:**
```python
# Detectar vendedor por grupo de Django
from django.contrib.auth.models import Group
token['is_vendedor'] = bool(user.groups.filter(name='Vendedor').exists())
```

**IMPORTANTE:** Agregar el import al inicio del archivo si no está:
```python
from django.contrib.auth.models import Group
```

### 2. Script para asignar grupo Vendedor

**Ejecutar en la VM:**

```bash
cd /opt/inmobicasita
source venv/bin/activate
python manage.py shell
```

**Y pegar este código:**

```python
from django.contrib.auth.models import User, Group

# Obtener o crear grupo Vendedor
vendedor_group, created = Group.objects.get_or_create(name='Vendedor')
if created:
    print(f"✅ Grupo 'Vendedor' creado")
else:
    print(f"ℹ️  Grupo 'Vendedor' ya existe")

# Asignar grupo al usuario vendedor1
vendedor = User.objects.get(username='vendedor1')
vendedor.groups.add(vendedor_group)
vendedor.save()
print(f"✅ Usuario {vendedor.username} asignado como Vendedor")
print(f"   Grupos del usuario: {[g.name for g in vendedor.groups.all()]}")
```

**O usar el script `asignar_vendedor.py` que está en el repositorio.**

### 3. El filtro de inmuebles ya está bien
El `InmuebleViewSet.get_queryset()` ya filtra por `usuario`, así que los vendedores verán todos los inmuebles donde `usuario=vendedor_user`, sin importar quién los creó (admin o el mismo vendedor).

### 4. Asignar vendedores desde Django Admin

**Para asignar un usuario como vendedor desde el admin:**
1. Ir a Django Admin → Users
2. Seleccionar el usuario
3. En la sección "Groups", agregar el grupo "Vendedor"
4. Guardar

**O desde el shell:**
```python
from django.contrib.auth.models import User, Group
vendedor_group = Group.objects.get(name='Vendedor')
usuario = User.objects.get(username='nombre_usuario')
usuario.groups.add(vendedor_group)
```

### 5. Verificar cambios

Después de hacer los cambios:
1. Reiniciar el servicio: `sudo systemctl restart inmobicasita`
2. Cerrar sesión en el frontend
3. Iniciar sesión de nuevo como vendedor1
4. Debería redirigir a `/vendedor` y mostrar todos los inmuebles asignados
