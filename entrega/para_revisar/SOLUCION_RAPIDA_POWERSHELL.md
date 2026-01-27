# Solución Rápida - Error de Ejecución de Scripts en PowerShell

## 🚨 Tu Error
```
npm : No se puede cargar el archivo ... porque la ejecución de scripts está deshabilitada
```

## ✅ Solución Inmediata (2 Opciones)

### Opción 1: Usar CMD en lugar de PowerShell (MÁS RÁPIDO)

1. **Cierra PowerShell**
2. **Abre CMD** (Símbolo del sistema):
   - Presiona `Win + R`
   - Escribe: `cmd`
   - Presiona Enter
3. **Navega al proyecto**:
   ```cmd
   cd D:\Carlos\Desktop\inmobicasita_api\frontend
   ```
4. **Ejecuta npm**:
   ```cmd
   npm install
   ```

**CMD no tiene restricciones de política de ejecución** ✅

### Opción 2: Ejecutar PowerShell como Administrador

1. **Cierra PowerShell actual**
2. **Busca "PowerShell"** en el menú inicio
3. **Clic derecho** → **"Ejecutar como administrador"**
4. **Ejecuta este comando**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
   ```
5. Responde **Y** cuando pregunte
6. **Cierra y reabre PowerShell** normal
7. Prueba:
   ```powershell
   npm --version
   ```

## 🔍 Verificar si Funciona

Después de cualquiera de las opciones:

```bash
npm --version
```

Si ves un número de versión, ¡funciona! 🎉

## 💡 Recomendación

**Para desarrollo, usa CMD** - Es más simple y no tiene estos problemas.

Solo necesitas PowerShell si:
- Usas comandos específicos de PowerShell
- Trabajas con scripts avanzados

Para npm, node, y comandos básicos, **CMD funciona perfectamente**.

---

**Tiempo estimado**: 2 minutos
