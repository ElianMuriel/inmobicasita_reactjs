#!/bin/bash
# Script para aplicar cambios automáticamente en el backend
# USAR CON PRECAUCIÓN - Hacer backup primero

echo "=== Aplicando cambios en el backend ==="
echo ""

# Ir al directorio del proyecto
cd /opt/inmobicasita

# Hacer backup
echo "1. Haciendo backup..."
cp gestion/models.py gestion/models.py.backup
cp gestion/views.py gestion/views.py.backup
cp gestion/serializers.py gestion/serializers.py.backup
cp gestion/urls.py gestion/urls.py.backup
echo "✓ Backup completado"
echo ""

# Nota: Este script NO modifica los archivos automáticamente
# porque es mejor hacerlo manualmente para evitar errores
# Pero puedes usar estos comandos como referencia

echo "=== INSTRUCCIONES ==="
echo ""
echo "Los archivos de backup están creados."
echo "Por favor, sigue las instrucciones en INSTRUCCIONES_PASO_A_PASO.md"
echo "para aplicar los cambios manualmente."
echo ""
echo "O usa los archivos en ARCHIVOS_COMPLETOS.md como referencia."
echo ""
