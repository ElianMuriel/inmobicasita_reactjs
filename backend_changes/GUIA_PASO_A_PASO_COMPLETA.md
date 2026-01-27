# Guía Paso a Paso Completa - Aplicar Cambios en el Backend

## 🎯 Objetivo

Aplicar los cambios necesarios para que el frontend funcione completamente con el backend, usando una estructura de usuario limpia.

## ⚠️ IMPORTANTE: Hacer Backup Primero

```bash
# Conéctate a tu VM
ssh elianadmin@<tu-ip-publica>

# Ir al directorio del proyecto
cd /opt/inmobicasita

# Crear backups
cp gestion/models.py gestion/models.py.backup
cp gestion/views.py gestion/views.py.backup
cp gestion/serializers.py gestion/serializers.py.backup
cp gestion/urls.py gestion/urls.py.backup

echo "✓ Backups creados"
```

---

## 📝 PASO 1: Modificar models.py

```bash
cd /opt/inmobicasita/gestion
nano models.py
```

### 1.1. Agregar campo `user` al modelo Cliente

**Buscar esta sección:**
```python
class Cliente(models.Model):
    TIPO_CLIENTE_CHOICES = (
        ('COMPRADOR', 'Comprador'),
        ('ARRENDATARIO', 'Arrendatario'),
        ('INVERSOR', 'Inversor'),
        ('OTRO', 'Otro'),
    )

    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    identificacion = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    ciudad = models.CharField(max_length=100, blank=True)
    tipo_cliente = models.CharField(max_length=20, choices=TIPO_CLIENTE_CHOICES, default='COMPRADOR')
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"
```

**Agregar DESPUÉS de `activo = models.BooleanField(default=True)`:**
```python
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cliente_profile'
    )
```

**El modelo Cliente completo debería quedar así:**
```python
class Cliente(models.Model):
    TIPO_CLIENTE_CHOICES = (
        ('COMPRADOR', 'Comprador'),
        ('ARRENDATARIO', 'Arrendatario'),
        ('INVERSOR', 'Inversor'),
        ('OTRO', 'Otro'),
    )

    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    identificacion = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    direccion = models.CharField(max_length=200, blank=True)
    ciudad = models.CharField(max_length=100, blank=True)
    tipo_cliente = models.CharField(max_length=20, choices=TIPO_CLIENTE_CHOICES, default='COMPRADOR')
    activo = models.BooleanField(default=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cliente_profile'
    )

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 📝 PASO 2: Modificar serializers.py

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
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'
```

**Guardar:** `Ctrl+O`, `Enter`, `Ctrl+X`

---

## 📝 PASO 3: Modificar views.py

```bash
nano views.py
```

### 3.1. Modificar InmuebleViewSet

**Buscar:**
```python
class InmuebleViewSet(viewsets.ModelViewSet):
    queryset = Inmueble.objects.all()
    serializer_class = InmuebleSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['codigo_interno', 'titulo', 'ciudad', 'barrio', 'tipo_operacion', 'estado']
```

**Agregar DESPUÉS de `search_fields`:**
```python
    def get_queryset(self):
        queryset = Inmueble.objects.all()
        usuario = self.request.query_params.get('usuario', None)
        if usuario:
            queryset = queryset.filter(usuario_id=usuario)
        return queryset
```

**El InmuebleViewSet completo debería quedar así:**
```python
class InmuebleViewSet(viewsets.ModelViewSet):
    queryset = Inmueble.objects.all()
    serializer_class = InmuebleSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['codigo_interno', 'titulo', 'ciudad', 'barrio', 'tipo_operacion', 'estado']
    
    def get_queryset(self):
        queryset = Inmueble.objects.all()
        usuario = self.request.query_params.get('usuario', None)
        if usuario:
            queryset = queryset.filter(usuario_id=usuario)
        return queryset
```

### 3.2. Agregar función mi_cliente

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

### 3.3. Modificar función register

**Buscar en la función `register` esta parte:**
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

---

## 📝 PASO 4: Modificar urls.py

```bash
nano urls.py
```

### 4.1. Agregar mi_cliente al import

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

### 4.2. Agregar ruta

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

---

## 🔄 PASO 5: Crear y Aplicar Migraciones

```bash
cd /opt/inmobicasita
source venv/bin/activate  # Si usas virtualenv

# Crear migraciones
python manage.py makemigrations gestion

# Ver qué se va a migrar (revisar el output)
# Debería mostrar algo como:
# Migrations for 'gestion':
#   gestion/migrations/XXXX_add_user_to_cliente.py
#     - Add field user to cliente

# Aplicar migraciones
python manage.py migrate gestion
```

**Si hay algún error, revisa el mensaje y corrígelo antes de continuar.**

---

## 🔧 PASO 6: Asociar Clientes Existentes con Usuarios

Si ya tienes usuarios y clientes registrados, necesitas asociarlos:

```bash
python manage.py shell
```

**En el shell de Django, ejecuta este código:**

```python
from django.contrib.auth.models import User
from gestion.models import Cliente

# Método 1: Asociar por email (si coinciden)
usuarios_asociados = 0
for user in User.objects.all():
    if user.email:
        try:
            cliente = Cliente.objects.filter(email=user.email).first()
            if cliente and not cliente.user:
                cliente.user = user
                cliente.save()
                usuarios_asociados += 1
                print(f"✓ Asociado {user.username} con cliente {cliente.nombres} {cliente.apellidos}")
        except Exception as e:
            print(f"✗ Error con {user.username}: {e}")

print(f"\n✓ Total asociados: {usuarios_asociados}")

# Método 2: Si tienes una forma manual de asociar
# Puedes hacerlo uno por uno:
# cliente = Cliente.objects.get(id=1)
# cliente.user = User.objects.get(id=1)
# cliente.save()

exit()
```

---

## 🧪 PASO 7: Verificar que No Hay Errores de Sintaxis

```bash
cd /opt/inmobicasita
python manage.py check
```

**Debería mostrar:**
```
System check identified no issues (0 silenced).
```

**Si hay errores, corrígelos antes de continuar.**

---

## 🚀 PASO 8: Reiniciar el Servidor

```bash
# Si usas systemd
sudo systemctl restart inmobicasita

# Verificar que está corriendo
sudo systemctl status inmobicasita

# O si usas gunicorn directamente, reinicia el proceso
```

---

## ✅ PASO 9: Probar los Cambios

### 9.1. Probar Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"tu_usuario","password":"tu_password"}'
```

**Debería devolver tokens.**

### 9.2. Probar Obtener Cliente (después de login)

```bash
# Reemplaza TU_TOKEN con el access token del login anterior
curl -X GET http://localhost:8000/api/auth/mi-cliente/ \
  -H "Authorization: Bearer TU_TOKEN"
```

**Debería devolver los datos del cliente asociado al usuario.**

### 9.3. Probar Filtrar Inmuebles por Usuario

```bash
curl -X GET "http://localhost:8000/api/inmuebles/?usuario=1" \
  -H "Authorization: Bearer TU_TOKEN"
```

**Debería devolver solo los inmuebles del usuario 1.**

---

## 🐛 Si Algo Sale Mal

### Restaurar Backups:

```bash
cd /opt/inmobicasita
cp gestion/models.py.backup gestion/models.py
cp gestion/views.py.backup gestion/views.py
cp gestion/serializers.py.backup gestion/serializers.py
cp gestion/urls.py.backup gestion/urls.py
```

### Ver Logs:

```bash
# Si usas systemd
sudo journalctl -u inmobicasita -n 50

# O ver logs de gunicorn
tail -f /var/log/gunicorn/error.log
```

---

## 📋 Checklist Final

- [ ] Backups creados
- [ ] models.py modificado (campo user en Cliente)
- [ ] serializers.py modificado (user_id y username en ClienteSerializer)
- [ ] views.py modificado (get_queryset, mi_cliente, register)
- [ ] urls.py modificado (ruta mi-cliente)
- [ ] Migraciones creadas y aplicadas
- [ ] Clientes existentes asociados con usuarios
- [ ] No hay errores de sintaxis (python manage.py check)
- [ ] Servidor reiniciado
- [ ] Endpoints probados y funcionando

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, el backend estará listo para trabajar con el frontend.

**Próximo paso:** Configurar la URL de Azure en el frontend (ver `CONFIGURACION_AZURE.md`).
