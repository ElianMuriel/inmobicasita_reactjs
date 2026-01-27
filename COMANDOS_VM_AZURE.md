# Comandos para Ejecutar en tu VM de Azure

Ejecuta estos comandos en tu VM de Azure (por SSH) y comparte los resultados aquí.

## 📋 Comandos a Ejecutar

### 1. Ver la estructura del proyecto
```bash
cd /opt/inmobicasita
find . -type f -name "*.py" | head -20
```

### 2. Ver el contenido de models.py
```bash
cat gestion/models.py
```

### 3. Ver el contenido de serializers.py
```bash
cat gestion/serializers.py
```

### 4. Ver el contenido de views.py
```bash
cat gestion/views.py
```

### 5. Ver el contenido de urls.py (gestion)
```bash
cat gestion/urls.py
```

### 6. Ver el contenido de settings.py
```bash
cat inmobicasita_api/settings.py
```

### 7. Ver el contenido de urls.py principal
```bash
cat inmobicasita_api/urls.py
```

### 8. Ver la estructura de usuarios/roles (si hay un modelo de Usuario personalizado)
```bash
grep -r "class.*User" gestion/models.py
grep -r "rol\|role\|tipo_usuario\|is_vendedor" gestion/models.py
```

## 🔍 Información Adicional Útil

### Ver la URL de la API
```bash
# Ver configuración de nginx o gunicorn
cat /etc/nginx/sites-available/* 2>/dev/null || echo "No nginx config found"
# O ver variables de entorno
env | grep -i "api\|url\|host"
```

### Ver configuración de CORS
```bash
grep -A 10 "CORS" inmobicasita_api/settings.py
```

### Ver configuración de autenticación JWT
```bash
grep -A 10 "JWT\|jwt\|token" inmobicasita_api/settings.py
```

## 📝 Forma Más Rápida (Todo en Uno)

Si prefieres, puedes ejecutar este comando que muestra todo lo importante:

```bash
cd /opt/inmobicasita && echo "=== MODELS ===" && cat gestion/models.py && echo -e "\n\n=== SERIALIZERS ===" && cat gestion/serializers.py && echo -e "\n\n=== VIEWS ===" && cat gestion/views.py && echo -e "\n\n=== URLS (gestion) ===" && cat gestion/urls.py && echo -e "\n\n=== SETTINGS ===" && cat inmobicasita_api/settings.py
```

## 🎯 Lo que Necesito Específicamente

1. **Cómo se definen los roles**: ¿Hay un campo `rol` en el modelo User? ¿Hay un modelo separado?
2. **Qué campos tiene el token JWT**: ¿Qué información se incluye en el payload del token?
3. **Endpoints disponibles**: ¿Qué rutas tiene la API?
4. **Permisos**: ¿Cómo se verifica si un usuario es vendedor o cliente?

---

**Nota**: Puedes copiar y pegar la salida de estos comandos aquí, o si los archivos son muy largos, puedes usar `head` y `tail` para mostrarme partes específicas.
