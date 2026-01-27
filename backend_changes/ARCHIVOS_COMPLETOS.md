# Archivos Completos con los Cambios Aplicados

Estos son los archivos completos después de aplicar todos los cambios. Úsalos como referencia.

## 📄 models.py (solo la parte del modelo Cliente)

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

## 📄 serializers.py (solo ClienteSerializer)

```python
class ClienteSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'
```

## 📄 views.py (solo las partes modificadas)

### InmuebleViewSet completo:

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

### Función mi_cliente (agregar antes de register):

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

### Función register (solo la parte modificada):

```python
        cliente = Cliente.objects.create(
            nombres=nombres or '',
            apellidos=apellidos or '',
            identificacion=identificacion or '',
            email=email or '',
            telefono=telefono,
            direccion=direccion,
            activo=True,
            user=user  # LÍNEA AGREGADA
        )
```

## 📄 urls.py (completo)

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    RolViewSet, PropietarioViewSet, ClienteViewSet,
    TipoInmuebleViewSet, InmuebleViewSet,
    VisitaViewSet, ContratoViewSet, PagoViewSet, ProfileView, register, mi_cliente
)

router = DefaultRouter()
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'propietarios', PropietarioViewSet, basename='propietario')
router.register(r'clientes', ClienteViewSet, basename='cliente')
router.register(r'tipos-inmueble', TipoInmuebleViewSet, basename='tipo-inmueble')
router.register(r'inmuebles', InmuebleViewSet, basename='inmueble')
router.register(r'visitas', VisitaViewSet, basename='visita')
router.register(r'contratos', ContratoViewSet, basename='contrato')
router.register(r'pagos', PagoViewSet, basename='pago')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('auth/register/', register, name='register'),
    path('auth/mi-cliente/', mi_cliente, name='mi-cliente'),
]
```

---

**Nota**: Estos son solo los archivos modificados. Los demás archivos (Rol, Propietario, etc.) no necesitan cambios.
