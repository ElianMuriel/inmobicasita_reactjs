# Ajustes Necesarios en el Backend

Basándome en el análisis del código, hay algunos ajustes que sería bueno hacer en el backend para que el sistema de roles funcione mejor:

## 🔧 Problemas Identificados

### 1. Relación Usuario-Cliente
**Problema**: Cuando un cliente se registra, se crea un `User` y un `Cliente` separados, pero no hay relación directa entre ellos.

**Solución sugerida**: Agregar un campo `user` al modelo `Cliente`:

```python
# En gestion/models.py
class Cliente(models.Model):
    # ... campos existentes ...
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cliente_profile'
    )
```

Y actualizar el serializer para incluir el user_id:

```python
# En gestion/serializers.py
class ClienteSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    
    class Meta:
        model = Cliente
        fields = '__all__'
```

### 2. Sistema de Roles
**Problema**: No hay forma clara de identificar si un usuario es VENDEDOR o CLIENTE.

**Solución sugerida**: Agregar un campo `rol` al modelo User o crear un perfil:

**Opción A - Campo en User (más simple)**:
```python
# Agregar al modelo User usando un proxy o perfil
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)
```

**Opción B - Usar Django Groups**:
```python
# En views.py o signals.py
from django.contrib.auth.models import Group

# Crear grupos
vendedor_group, _ = Group.objects.get_or_create(name='Vendedor')
cliente_group, _ = Group.objects.get_or_create(name='Cliente')

# Asignar grupos según corresponda
```

### 3. Incluir Rol en el Token JWT
**Problema**: El token JWT no incluye información del rol.

**Solución**: Personalizar el token para incluir el rol:

```python
# Crear archivo gestion/token.py
from rest_framework_simplejwt.tokens import RefreshToken

class CustomRefreshToken(RefreshToken):
    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)
        
        # Determinar rol
        rol = 'CLIENTE'
        if user.is_staff:
            rol = 'ADMIN'
        elif user.groups.filter(name='Vendedor').exists():
            rol = 'VENDEDOR'
        elif hasattr(user, 'userprofile') and user.userprofile.rol:
            rol = user.userprofile.rol.nombre_rol
        
        token['rol'] = rol
        token['user_id'] = user.id
        
        return token
```

Y actualizar settings.py:

```python
# En settings.py
SIMPLE_JWT = {
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

Y en views.py:

```python
from .token import CustomRefreshToken

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # ... código existente ...
    refresh = CustomRefreshToken.for_user(user)
    # ...
```

### 4. Endpoint para Obtener Cliente del Usuario Actual
**Problema**: El frontend necesita obtener el `cliente_id` del usuario actual.

**Solución**: Agregar endpoint:

```python
# En views.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mi_cliente(request):
    try:
        cliente = Cliente.objects.get(user=request.user)
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)
    except Cliente.DoesNotExist:
        return Response(
            {'error': 'No se encontró perfil de cliente'},
            status=status.HTTP_404_NOT_FOUND
        )
```

Y en urls.py:

```python
path('auth/mi-cliente/', mi_cliente, name='mi-cliente'),
```

### 5. Filtrar Inmuebles por Usuario
**Problema**: Los vendedores deberían ver solo sus inmuebles.

**Solución**: Actualizar el ViewSet:

```python
# En views.py
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

## 📝 Cambios Mínimos para que Funcione Ahora

Si no puedes hacer todos estos cambios, al menos:

1. **Agregar relación User-Cliente** en el modelo Cliente
2. **Crear endpoint `/api/auth/mi-cliente/`** para obtener el cliente_id del usuario
3. **Filtrar inmuebles por usuario** en el ViewSet

Con estos cambios mínimos, el frontend funcionará correctamente.

---

**Nota**: El frontend ya está preparado para trabajar con estos cambios. Una vez que los implementes, todo debería funcionar sin problemas.
