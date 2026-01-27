# Estructura de Usuario Limpia - InmobiCasita

## 🎯 Objetivo

Crear un sistema de usuarios limpio que:
- Solo tenga los campos necesarios
- Separe claramente: Usuario (autenticación) vs Perfil (datos del negocio)
- Facilite el manejo de roles
- Sea fácil de mantener

## 📊 Estructura Propuesta

### 1. User (Django) - Solo para Autenticación
**Campos mínimos necesarios:**
- `username` (requerido)
- `password` (requerido)
- `email` (opcional, para recuperación)
- `is_staff` (para ADMIN)
- `is_active` (para activar/desactivar)

**Campos que NO necesitamos:**
- `first_name` (lo tenemos en Cliente/Propietario)
- `last_name` (lo tenemos en Cliente/Propietario)
- `date_joined` (opcional, pero Django lo requiere)
- `last_login` (opcional, pero Django lo requiere)

### 2. PerfilUsuario (Nuevo Modelo) - Datos del Negocio
**Campos necesarios:**
- `user` (OneToOne con User)
- `rol` (ForeignKey a Rol)
- `telefono` (opcional)
- `fecha_registro` (opcional)

### 3. Cliente - Ya existe, solo agregar relación
- Mantener todos los campos actuales
- Agregar `user` (OneToOne con User)

### 4. Propietario - Ya existe
- Mantener como está (no necesita relación con User)

## 🔧 Implementación

### Opción A: Modelo de Perfil Simple (Recomendado)

```python
# En gestion/models.py

class PerfilUsuario(models.Model):
    """
    Perfil extendido del usuario Django
    Conecta User con Rol y datos adicionales
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='perfil'
    )
    rol = models.ForeignKey(
        Rol,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='usuarios'
    )
    telefono = models.CharField(max_length=20, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"Perfil de {self.user.username}"

    @property
    def es_admin(self):
        return self.user.is_staff
    
    @property
    def es_vendedor(self):
        return self.rol and self.rol.nombre_rol.upper() == 'VENDEDOR'
    
    @property
    def es_cliente(self):
        return self.rol and self.rol.nombre_rol.upper() == 'CLIENTE'
```

### Opción B: Solo Relación User-Cliente (Más Simple)

Si prefieres algo más simple, solo agregamos la relación User-Cliente y usamos `is_staff` para ADMIN:

```python
# En Cliente, agregar:
user = models.OneToOneField(
    User,
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    related_name='cliente_profile'
)

# Roles se determinan así:
# - ADMIN: user.is_staff == True
# - VENDEDOR: user tiene inmuebles registrados
# - CLIENTE: user tiene cliente asociado
```

## 💡 Recomendación

**Te recomiendo la Opción B (más simple)** porque:
1. Es más fácil de implementar
2. No requiere crear un modelo nuevo
3. Los roles se pueden determinar dinámicamente
4. Es suficiente para tu caso de uso

**La Opción A es mejor si:**
- Necesitas roles más complejos
- Quieres almacenar más datos del usuario
- Planeas tener muchos tipos de usuarios diferentes

## 📝 Cambios Necesarios

### Si eliges Opción B (Recomendada):

1. **Agregar campo `user` a Cliente** (ya está en las instrucciones)
2. **Crear roles en la base de datos** (si no existen):
   ```python
   # En Django shell
   from gestion.models import Rol
   Rol.objects.get_or_create(nombre_rol='ADMIN')
   Rol.objects.get_or_create(nombre_rol='VENDEDOR')
   Rol.objects.get_or_create(nombre_rol='CLIENTE')
   ```
3. **Determinar roles dinámicamente** en el frontend (ya está implementado)

### Si eliges Opción A (Perfil Completo):

1. Crear modelo `PerfilUsuario`
2. Crear migración
3. Crear serializer
4. Actualizar views para usar perfil
5. Actualizar frontend para usar perfil

---

**¿Cuál prefieres?** Te recomiendo empezar con la Opción B y luego, si necesitas más complejidad, migrar a la Opción A.
