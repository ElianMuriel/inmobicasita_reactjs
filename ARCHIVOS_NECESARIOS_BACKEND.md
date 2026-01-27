# Archivos del Backend que Necesito Ver

Para poder adaptar el frontend correctamente a tu API de Django en Azure, necesito revisar los siguientes archivos:

## 📋 Archivos Críticos

### 1. `gestion/models.py`
**¿Por qué?** Necesito ver:
- Cómo están definidos los modelos (Usuario, Inmueble, Cliente, Vendedor, etc.)
- Si hay un modelo de Rol o cómo se manejan los roles
- Los campos de cada modelo para crear los formularios correctos

### 2. `gestion/serializers.py`
**¿Por qué?** Necesito ver:
- Qué datos se envían en el token JWT (especialmente el rol del usuario)
- Los campos que se serializan para cada modelo
- Si hay campos relacionados que necesito manejar

### 3. `gestion/views.py`
**¿Por qué?** Necesito ver:
- Los permisos de cada endpoint (qué roles pueden hacer qué)
- Los endpoints disponibles
- Si hay endpoints específicos para vendedores o clientes

### 4. `gestion/urls.py`
**¿Por qué?** Necesito ver:
- Las rutas exactas de la API
- Qué endpoints están disponibles

### 5. `inmobicasita_api/settings.py`
**¿Por qué?** Necesito ver:
- Configuración de CORS (para permitir el frontend)
- Configuración de autenticación JWT
- ALLOWED_HOSTS (para saber la URL de Azure)

## 🔍 Información Específica que Necesito

1. **Roles de Usuario:**
   - ¿Cómo se define un VENDEDOR? (¿es un campo en User? ¿es un modelo separado?)
   - ¿Cómo se define un CLIENTE?
   - ¿Cómo se define un ADMIN? (¿solo is_staff=True?)

2. **Permisos:**
   - ¿Qué puede hacer un VENDEDOR? (crear inmuebles, ver citas, etc.)
   - ¿Qué NO puede hacer un VENDEDOR? (eliminar inmuebles según mencionaste)
   - ¿Qué puede hacer un CLIENTE? (ver propiedades, contactar, comprar)

3. **Endpoints:**
   - ¿Hay endpoints específicos para vendedores?
   - ¿Hay endpoints para que clientes contacten vendedores?
   - ¿Hay endpoints para procesar compras?

4. **URL de Azure:**
   - ¿Cuál es la URL completa de tu API en Azure? (ej: https://inmobicasita.azurewebsites.net/api)

## 📝 Cómo Compartir los Archivos

Puedes:
1. Copiar y pegar el contenido de cada archivo aquí
2. O darme acceso temporal a la VM para revisarlos
3. O crear un archivo temporal con el contenido

## 🎯 Lo que Haré Después

Una vez que tenga esta información:
1. Actualizaré el sistema de roles en el frontend
2. Crearé las rutas y componentes para cada rol
3. Implementaré los permisos correctos
4. Configuraré la URL de Azure
5. Haré que todo funcione 100% con tu backend

---

**Nota**: Si prefieres, puedo trabajar con supuestos razonables basados en tu descripción, pero es mejor tener la información exacta del backend para evitar errores.
