# Cambios de Permisos para Vendedor

## Problema
El vendedor no puede crear inmuebles porque `IsAdminOrReadOnly` solo permite crear/editar a usuarios con `is_staff=True`.

## Solución
Crear un permiso personalizado que permita a los vendedores crear y editar inmuebles, pero no eliminarlos.

## Cambios en `gestion/views.py`

### 1. Agregar nueva clase de permiso (después de `IsAdminOrReadOnly`):

```python
class IsAdminOrVendedorOrReadOnly(permissions.BasePermission):
    """
    Lectura para todos.
    Crear / actualizar para admin (is_staff=True) y vendedores (grupo Vendedor).
    Eliminar solo para admin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Admin puede hacer todo
        if request.user.is_staff:
            return True
        
        # Vendedor puede crear y editar, pero no eliminar
        if request.method == 'DELETE':
            return False  # Solo admin puede eliminar
        
        # Verificar si es vendedor
        from django.contrib.auth.models import Group
        vendedor_group = Group.objects.filter(name='Vendedor').first()
        if vendedor_group and request.user.groups.filter(name='Vendedor').exists():
            return True  # Vendedor puede crear y editar
        
        return False
```

### 2. Cambiar el `InmuebleViewSet` para usar el nuevo permiso:

**Buscar:**
```python
class InmuebleViewSet(viewsets.ModelViewSet):
    queryset = Inmueble.objects.all()
    serializer_class = InmuebleSerializer
    permission_classes = [IsAdminOrReadOnly]
```

**Cambiar por:**
```python
class InmuebleViewSet(viewsets.ModelViewSet):
    queryset = Inmueble.objects.all()
    serializer_class = InmuebleSerializer
    permission_classes = [IsAdminOrVendedorOrReadOnly]
```

### 3. Opcional: También aplicar a `VisitaViewSet` si quieres que los vendedores puedan gestionar visitas:

```python
class VisitaViewSet(viewsets.ModelViewSet):
    queryset = Visita.objects.all()
    serializer_class = VisitaSerializer
    permission_classes = [IsAdminOrVendedorOrReadOnly]  # Cambiar aquí también
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['inmueble__codigo_interno', 'cliente__nombres', 'cliente__apellidos', 'estado']
```
