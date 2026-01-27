# Comandos Útiles - InmobiCasita Frontend

## 📍 Importante: Siempre estar en el directorio correcto

**El `package.json` está en `frontend/`, no en la raíz del proyecto.**

```powershell
# Navegar al directorio correcto
cd D:\Carlos\Desktop\inmobicasita_api\frontend
```

## 🚀 Comandos Principales

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# El proyecto estará en: http://localhost:3000
```

### Build y Producción
```bash
# Crear build de producción
npm run build

# Previsualizar el build
npm run preview
```

### Verificar Instalación
```bash
# Ver versión de Node.js
node --version

# Ver versión de npm
npm --version

# Verificar que estás en el directorio correcto
dir package.json
# Debe mostrar: package.json
```

## 🔧 Solución de Problemas Comunes

### Error: "Could not read package.json"
**Causa**: Estás en el directorio incorrecto  
**Solución**: 
```powershell
cd frontend
```

### Error: "npm no se reconoce"
**Causa**: Node.js no está instalado  
**Solución**: Ver `INSTALACION_NODEJS.md`

### Error: "ejecución de scripts está deshabilitada"
**Causa**: Política de PowerShell  
**Solución**: Usar CMD o ver `SOLUCION_POWERSHELL.md`

### Vulnerabilidades en npm audit
**No es crítico para desarrollo**, pero puedes revisar:
```bash
npm audit
```

Para corregir (puede causar cambios):
```bash
npm audit fix
```

## 📂 Estructura de Directorios

```
inmobicasita_api/
├── inmobicasita_api/     # Backend Django
└── frontend/             # ← AQUÍ está el proyecto React
    ├── package.json      # ← Este archivo es importante
    ├── src/
    └── ...
```

## ✅ Checklist Antes de Ejecutar

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Estás en el directorio `frontend/`
- [ ] Dependencias instaladas (`npm install`)
- [ ] Backend Django ejecutándose en `http://127.0.0.1:8000`

## 🎯 Flujo de Trabajo Típico

1. **Abrir terminal en el directorio correcto**:
   ```powershell
   cd D:\Carlos\Desktop\inmobicasita_api\frontend
   ```

2. **Iniciar el backend** (en otra terminal):
   ```bash
   cd D:\Carlos\Desktop\inmobicasita_api\inmobicasita_api
   python manage.py runserver
   ```

3. **Iniciar el frontend**:
   ```bash
   npm run dev
   ```

4. **Abrir navegador**: `http://localhost:3000`

---

**Tip**: Crea un alias o script para navegar rápidamente al directorio correcto.
