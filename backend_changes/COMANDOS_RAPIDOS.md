# Comandos Rápidos - Copiar y Pegar

## 🔄 Secuencia Completa de Comandos

Copia y pega estos comandos en orden en tu VM de Azure:

```bash
# ============================================
# 1. CONECTARSE Y HACER BACKUP
# ============================================
cd /opt/inmobicasita
cp gestion/models.py gestion/models.py.backup
cp gestion/views.py gestion/views.py.backup
cp gestion/serializers.py gestion/serializers.py.backup
cp gestion/urls.py gestion/urls.py.backup
echo "✓ Backups creados"

# ============================================
# 2. MODIFICAR ARCHIVOS (usa nano o vi)
# ============================================
# Sigue las instrucciones en GUIA_PASO_A_PASO_COMPLETA.md
# para editar cada archivo

# ============================================
# 3. CREAR Y APLICAR MIGRACIONES
# ============================================
source venv/bin/activate  # Si usas virtualenv
python manage.py makemigrations gestion
python manage.py migrate gestion

# ============================================
# 4. ASOCIAR CLIENTES EXISTENTES
# ============================================
python manage.py shell << EOF
from django.contrib.auth.models import User
from gestion.models import Cliente

usuarios_asociados = 0
for user in User.objects.all():
    if user.email:
        cliente = Cliente.objects.filter(email=user.email).first()
        if cliente and not cliente.user:
            cliente.user = user
            cliente.save()
            usuarios_asociados += 1
            print(f"✓ {user.username} -> {cliente.nombres}")

print(f"\n✓ Total: {usuarios_asociados} asociados")
EOF

# ============================================
# 5. VERIFICAR SIN ERRORES
# ============================================
python manage.py check

# ============================================
# 6. REINICIAR SERVIDOR
# ============================================
sudo systemctl restart inmobicasita
sudo systemctl status inmobicasita

# ============================================
# 7. PROBAR (opcional)
# ============================================
echo "Probando login..."
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' || echo "Ajusta usuario/password"

echo ""
echo "✓ Proceso completado"
```

---

## 📝 Ediciones Manuales Necesarias

Después de hacer backup, necesitas editar estos archivos manualmente:

1. **gestion/models.py** - Agregar campo `user` a Cliente
2. **gestion/serializers.py** - Modificar ClienteSerializer
3. **gestion/views.py** - Agregar get_queryset, mi_cliente, modificar register
4. **gestion/urls.py** - Agregar ruta mi-cliente

**Ver detalles en:** `GUIA_PASO_A_PASO_COMPLETA.md`
