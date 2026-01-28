# 📸 Guía: Cómo Agregar Imágenes a las Propiedades

## 🎯 Resumen Ejecutivo

En el **Frontend** (React), el código ya está listo para mostrar imágenes. En el **Backend** (Django), debes configurar el modelo para almacenar imágenes.

---

## 🔧 Parte 1: Backend (Django)

### Opción A: Campo ImageField (Recomendado)

En tu archivo `models.py` del backend:

```python
from django.db import models

class Inmueble(models.Model):
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    # ... otros campos ...
    
    # AGREGAR ESTA LÍNEA:
    imagen = models.ImageField(
        upload_to='inmuebles/',  # Las imágenes se guardarán en /media/inmuebles/
        blank=True,              # Permitir que sea vacío
        null=True                # Permitir null en la base de datos
    )
    
    class Meta:
        db_table = 'inmuebles'
```

### Configuración Necesaria en Django

1. **Instalar Pillow** (para procesar imágenes):
```bash
pip install Pillow
```

2. **En `settings.py`** (si no está ya):
```python
# Configuración de archivos estáticos y media
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# En producción en VPS/Azure, usa storage en S3:
# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
```

3. **En `urls.py`** (para servir imágenes en desarrollo):
```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tu_app.urls')),
]

# Servir media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

4. **Crear migración y aplicarla**:
```bash
python manage.py makemigrations
python manage.py migrate
```

### En el Serializer (DRF)

```python
from rest_framework import serializers
from .models import Inmueble

class InmuebleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inmueble
        fields = [
            'id', 'titulo', 'descripcion', 'precio_venta', 
            'precio_arriendo', 'imagen', 'estado', 'tipo_operacion'
            # ... otros campos ...
        ]
```

---

## 🎨 Parte 2: Frontend (React) - YA CONFIGURADO

El código frontend ya está listo. Cuando el backend envíe una propiedad con `imagen`, se mostrará automáticamente:

```javascript
// En Propiedades.jsx (ya implementado)
backgroundImage: inmueble.imagen 
  ? `url(${inmueble.imagen})`  // Si tiene imagen, mostrarla
  : 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)'  // Si no, placeholder
```

---

## 📤 Cómo Agregar Imágenes en la Práctica

### En el Admin de Django

1. Ve a `http://localhost:8000/admin`
2. Selecciona "Inmuebles"
3. Edita o crea un inmueble
4. Verás un campo "Imagen" para subir archivos
5. Selecciona una imagen PNG/JPG
6. Guarda

### Mediante API (POST/PUT)

```bash
# Crear propiedad CON imagen
curl -X POST http://localhost:8000/api/inmuebles/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "titulo=Casa bonita" \
  -F "descripcion=Descripción..." \
  -F "precio_venta=50000" \
  -F "imagen=@ruta/a/imagen.jpg"

# Editar propiedad para agregar imagen
curl -X PUT http://localhost:8000/api/inmuebles/1/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "imagen=@ruta/a/imagen.jpg"
```

---

## 🖼️ Resultado en Frontend

Cuando hagas una petición GET a `/api/inmuebles/`, recibirás:

```json
{
  "id": 1,
  "titulo": "Casa bonita",
  "descripcion": "Una casa hermosa",
  "precio_venta": 50000,
  "imagen": "/media/inmuebles/casa_bonita.jpg",
  "estado": "DISPONIBLE"
}
```

Y en la tarjeta se verá automáticamente:

```
┌─────────────────────┐
│  [IMAGEN AQUI]      │
│                     │
│  DISPONIBLE ✓       │
├─────────────────────┤
│ Casa bonita         │
│ $50,000             │
│ [Ver] [Contactar]   │
└─────────────────────┘
```

---

## 🚀 Para Producción (VPS/Azure)

En lugar de guardar archivos locales, usa **AWS S3** o **Azure Blob Storage**:

```python
# Instalar
pip install django-storages boto3

# En settings.py
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = 'tu_key'
AWS_SECRET_ACCESS_KEY = 'tu_secret'
AWS_STORAGE_BUCKET_NAME = 'tu_bucket'
AWS_S3_REGION_NAME = 'us-east-1'
AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'
```

Las imágenes se guardarán en la nube automáticamente.

---

## ✅ Checklist para Implementar

- [ ] Agregar campo `imagen` al modelo Inmueble
- [ ] Instalar Pillow: `pip install Pillow`
- [ ] Configurar MEDIA_URL y MEDIA_ROOT en settings.py
- [ ] Agregar rutas media en urls.py (desarrollo)
- [ ] Incluir `imagen` en el serializer
- [ ] Hacer migraciones: `makemigrations` y `migrate`
- [ ] Subir imágenes mediante admin o API
- [ ] Verificar en Frontend que aparecen

---

## 🐛 Troubleshooting

**P: Las imágenes no aparecen**
R: Verifica que:
- MEDIA_ROOT está configurado correctamente
- Las imágenes están en la carpeta `/media/inmuebles/`
- El URL de la imagen es accesible (ej: `http://localhost:8000/media/inmuebles/...`)

**P: Error al subir imágenes**
R: Instala Pillow: `pip install Pillow --upgrade`

**P: En producción no se ven las imágenes**
R: Usa S3/Azure Blob Storage en lugar de archivos locales

---

## 📝 Ejemplo Completo de Modelo

```python
from django.db import models
from django.contrib.auth.models import User

class Inmueble(models.Model):
    ESTADO_CHOICES = [
        ('DISPONIBLE', 'Disponible'),
        ('RESERVADO', 'Reservado'),
        ('VENDIDO', 'Vendido'),
        ('ARRENDADO', 'Arrendado'),
        ('INACTIVO', 'Inactivo'),
    ]
    
    OPERACION_CHOICES = [
        ('VENTA', 'Venta'),
        ('ARRIENDO', 'Arriendo'),
        ('AMBOS', 'Venta y Arriendo'),
    ]
    
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    precio_venta = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    precio_arriendo = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    # AGREGAR IMAGEN AQUI
    imagen = models.ImageField(upload_to='inmuebles/', blank=True, null=True)
    
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    tipo_operacion = models.CharField(max_length=20, choices=OPERACION_CHOICES)
    
    propietario = models.ForeignKey(User, on_delete=models.CASCADE)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'inmuebles'
    
    def __str__(self):
        return self.titulo
```

¡Listo! Con esto las imágenes funcionarán perfectamente. 🎉
