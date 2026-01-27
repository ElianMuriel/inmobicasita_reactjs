# Instrucciones Paso a Paso - Aplicar Cambios en el Backend

Sigue estos pasos en orden en tu VM de Azure.

## 📋 Paso 1: Hacer Backup (IMPORTANTE)

```bash
cd /opt/inmobicasita
cp gestion/models.py gestion/models.py.backup
cp gestion/views.py gestion/views.py.backup
cp gestion/serializers.py gestion/serializers.py.backup
cp gestion/urls.py gestion/urls.py.backup
```

## 📝 Paso 2: Modificar models.py

```bash
cd /opt/inmobicasita/gestion
nano models.py
```

**Buscar esta línea en el modelo Cliente:**
```python
    activo = models.BooleanField(default=True)
```

**Agregar DESPUÉS de esa línea:**
```python
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cliente_profile'
    )
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

## 📝 Paso 3: Modificar serializers.py

```bash
nano serializers.py
```

**Buscar:**
```python
class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'
```

**Reemplazar con:**
```python
class ClienteSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

## 📝 Paso 4: Modificar views.py

```bash
nano views.py
```

### 4.1. Modificar InmuebleViewSet

**Buscar:**
```python
class InmuebleViewSet(viewsets.ModelViewSet):
    queryset = Inmueble.objects.all()
    serializer_class = InmuebleSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['codigo_interno', 'titulo', 'ciudad', 'barrio', 'tipo_operacion', 'estado']
```

**Agregar DESPUÉS de search_fields:**
```python
    def get_queryset(self):
        queryset = Inmueble.objects.all()
        usuario = self.request.query_params.get('usuario', None)
        if usuario:
            queryset = queryset.filter(usuario_id=usuario)
        return queryset
```

### 4.2. Agregar función mi_cliente

**Ir al final del archivo, ANTES de la función `register`**, y agregar:

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mi_cliente(request):
    '''
    Obtiene el perfil de cliente asociado al usuario actual
    '''
    try:
        cliente = Cliente.objects.get(user=request.user)
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)
    except Cliente.DoesNotExist:
        return Response(
            {'error': 'No se encontró perfil de cliente para este usuario'},
            status=status.HTTP_404_NOT_FOUND
        )
```

### 4.3. Modificar función register

**Buscar en la función `register`:**
```python
        cliente = Cliente.objects.create(
            nombres=nombres or '',
            apellidos=apellidos or '',
            identificacion=identificacion or '',
            email=email or '',
            telefono=telefono,
            direccion=direccion,
            activo=True
        )
```

**Cambiar a:**
```python
        cliente = Cliente.objects.create(
            nombres=nombres or '',
            apellidos=apellidos or '',
            identificacion=identificacion or '',
            email=email or '',
            telefono=telefono,
            direccion=direccion,
            activo=True,
            user=user  # AGREGAR ESTA LÍNEA
        )
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

## 📝 Paso 5: Modificar urls.py

```bash
nano urls.py
```

### 5.1. Agregar mi_cliente al import

**Buscar:**
```python
from .views import (
    RolViewSet, PropietarioViewSet, ClienteViewSet,
    TipoInmuebleViewSet, InmuebleViewSet,
    VisitaViewSet, ContratoViewSet, PagoViewSet, ProfileView, register
)
```

**Cambiar a:**
```python
from .views import (
    RolViewSet, PropietarioViewSet, ClienteViewSet,
    TipoInmuebleViewSet, InmuebleViewSet,
    VisitaViewSet, ContratoViewSet, PagoViewSet, ProfileView, register, mi_cliente
)
```

### 5.2. Agregar ruta

**Buscar:**
```python
urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/register/', register, name='register'),
]
```

**Cambiar a:**
```python
urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/register/', register, name='register'),
    path('auth/mi-cliente/', mi_cliente, name='mi-cliente'),
]
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

## 🔄 Paso 6: Crear y Aplicar Migraciones

```bash
cd /opt/inmobicasita
source venv/bin/activate  # Si usas virtualenv
python manage.py makemigrations gestion
python manage.py migrate gestion
```

## 🔧 Paso 7: Asociar Clientes Existentes con Usuarios

Si ya tienes clientes registrados, necesitas asociarlos con sus usuarios:

```bash
python manage.py shell
```

En el shell de Django, ejecuta:

```python
from django.contrib.auth.models import User
from gestion.models import Cliente

# Para cada usuario que tenga un cliente asociado por email
for user in User.objects.all():
    if user.email:
        try:
            cliente = Cliente.objects.get(email=user.email)
            if not cliente.user:
                cliente.user = user
                cliente.save()
                print(f"Asociado {user.username} con cliente {cliente.nombres}")
        except Cliente.DoesNotExist:
            pass
        except Cliente.MultipleObjectsReturned:
            # Si hay múltiples clientes con el mismo email, tomar el primero
            cliente = Cliente.objects.filter(email=user.email).first()
            if cliente and not cliente.user:
                cliente.user = user
                cliente.save()
                print(f"Asociado {user.username} con cliente {cliente.nombres}")

exit()
```

## 🧪 Paso 8: Probar los Cambios

```bash
# Reiniciar el servidor (si usas systemd)
sudo systemctl restart inmobicasita

# O si usas gunicorn directamente:
# Detener el proceso actual y reiniciarlo
```

## ✅ Paso 9: Verificar que Funciona

Prueba estos endpoints:

```bash
# 1. Login (debería funcionar igual)
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"tu_usuario","password":"tu_password"}'

# 2. Obtener perfil de cliente (después de login, usar el token)
curl -X GET http://localhost:8000/api/auth/mi-cliente/ \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# 3. Filtrar inmuebles por usuario
curl -X GET "http://localhost:8000/api/inmuebles/?usuario=1" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🐛 Si Algo Sale Mal

Si hay errores, puedes restaurar los backups:

```bash
cd /opt/inmobicasita
cp gestion/models.py.backup gestion/models.py
cp gestion/views.py.backup gestion/views.py
cp gestion/serializers.py.backup gestion/serializers.py
cp gestion/urls.py.backup gestion/urls.py
```

## 📝 Notas Importantes

1. **El campo `user` en Cliente es opcional** (`null=True, blank=True`), así que los clientes existentes seguirán funcionando.

2. **Los nuevos registros** automáticamente asociarán el cliente con el usuario.

3. **Si un usuario no tiene cliente asociado**, el endpoint `/api/auth/mi-cliente/` devolverá un 404, lo cual es normal.

4. **El filtrado de inmuebles por usuario** es opcional - si no se envía el parámetro `usuario`, se devuelven todos los inmuebles.

---

**Una vez completados estos pasos, el frontend debería funcionar completamente con el backend.**
