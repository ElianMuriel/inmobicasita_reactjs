# Análisis del Backend - InmobiCasita

## 📊 Modelos Identificados

### Modelo Rol
- `nombre_rol`: CharField (ADMIN, VENDEDOR, CLIENTE, etc.)
- `descripcion`: TextField
- **Nota**: No veo relación directa con User. Probablemente se maneje con:
  - Django Groups
  - Campo personalizado en User
  - O se determine por `is_staff`

### Modelos con relación a User
- `Inmueble.usuario`: ForeignKey a User (vendedor que registró)
- `Visita.usuario`: ForeignKey a User (vendedor que programó)
- `Contrato.usuario`: ForeignKey a User (vendedor que gestionó)

## 🔍 Lo que Necesito Ver Ahora

1. **serializers.py**: Para ver qué datos se envían en el token JWT
2. **views.py**: Para ver los permisos y cómo se verifica el rol
3. **settings.py**: Para ver configuración de JWT y CORS
4. **urls.py**: Para ver las rutas de la API

## 💡 Observaciones Iniciales

- El modelo `Rol` existe pero no está relacionado con `User`
- Probablemente los roles se manejen con:
  - `is_staff=True` para ADMIN
  - Django Groups para otros roles
  - O un modelo de perfil de usuario

## 🎯 Próximos Pasos

Una vez que vea los serializers y views, podré:
1. Ajustar la detección de roles en el frontend
2. Configurar los permisos correctamente
3. Asegurar que los endpoints funcionen correctamente
