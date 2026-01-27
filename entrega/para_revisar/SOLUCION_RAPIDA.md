# Solución Rápida - Error npm no reconocido

## 🚨 Problema
```
npm : El término 'npm' no se reconoce como nombre de un cmdlet
```

## ✅ Solución en 3 Pasos

### Paso 1: Instalar Node.js
1. Ve a: **https://nodejs.org/**
2. Descarga la versión **LTS** (botón verde)
3. Ejecuta el instalador
4. ✅ Marca "Add to PATH" durante la instalación
5. Completa la instalación

### Paso 2: Reiniciar Terminal
- **Cierra completamente** PowerShell/CMD
- **Abre una nueva terminal**

### Paso 3: Verificar
```powershell
node --version
npm --version
```

Si ves las versiones, ¡está funcionando! 🎉

### Paso 4: Instalar Dependencias
```powershell
cd frontend
npm install
```

---

## ⚠️ Si aún no funciona:

1. **Reinicia tu computadora**
2. O verifica el PATH manualmente (ver `INSTALACION_NODEJS.md`)

---

**Tiempo estimado**: 5-10 minutos
