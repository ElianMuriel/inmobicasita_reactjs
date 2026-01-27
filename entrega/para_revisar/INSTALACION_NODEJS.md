# Instalación de Node.js y npm - Windows

## Problema
El error `npm : El término 'npm' no se reconoce` indica que Node.js no está instalado o no está en el PATH del sistema.

## Solución: Instalar Node.js

### Opción 1: Instalador Oficial (Recomendado)

1. **Descargar Node.js**
   - Visita: https://nodejs.org/
   - Descarga la versión **LTS** (Long Term Support) - recomendada para la mayoría de usuarios
   - El archivo será algo como: `node-v20.x.x-x64.msi`

2. **Ejecutar el Instalador**
   - Haz doble clic en el archivo descargado
   - Sigue el asistente de instalación
   - **IMPORTANTE**: Asegúrate de marcar la opción **"Add to PATH"** durante la instalación
   - Completa la instalación

3. **Verificar la Instalación**
   - Cierra y vuelve a abrir PowerShell o CMD
   - Ejecuta:
     ```powershell
     node --version
     npm --version
     ```
   - Deberías ver las versiones instaladas

### Opción 2: Usando Chocolatey (Si lo tienes instalado)

```powershell
choco install nodejs
```

### Opción 3: Usando winget (Windows 10/11)

```powershell
winget install OpenJS.NodeJS.LTS
```

## Después de Instalar

1. **Cerrar y Reabrir la Terminal**
   - Es importante cerrar completamente PowerShell/CMD y abrirlo de nuevo
   - Esto asegura que el PATH se actualice

2. **Verificar Instalación**
   ```powershell
   node --version
   npm --version
   ```

3. **Instalar Dependencias del Proyecto**
   ```powershell
   cd frontend
   npm install
   ```

4. **Ejecutar el Proyecto**
   ```powershell
   npm run dev
   ```

## Solución de Problemas

### Si después de instalar aún no funciona:

1. **Verificar PATH Manualmente**
   - Node.js normalmente se instala en: `C:\Program Files\nodejs\`
   - Verifica que esta ruta esté en tu PATH:
     - Presiona `Win + R`
     - Escribe: `sysdm.cpl`
     - Ve a la pestaña "Opciones avanzadas"
     - Clic en "Variables de entorno"
     - En "Variables del sistema", busca "Path"
     - Verifica que `C:\Program Files\nodejs\` esté listado
     - Si no está, agrégalo

2. **Reiniciar la Computadora**
   - A veces es necesario reiniciar para que los cambios en PATH tomen efecto

3. **Instalar Versión Específica**
   - Si tienes problemas, intenta con Node.js 18.x o 20.x LTS

## Versiones Recomendadas

- **Node.js**: 18.x LTS o 20.x LTS
- **npm**: Se instala automáticamente con Node.js (versión 9.x o superior)

## Verificar Versión Mínima Requerida

Este proyecto requiere:
- Node.js: 16.0.0 o superior
- npm: 7.0.0 o superior (viene con Node.js)

## Enlaces Útiles

- **Node.js Oficial**: https://nodejs.org/
- **Documentación npm**: https://docs.npmjs.com/
- **Guía de Instalación**: https://nodejs.org/en/download/package-manager/

---

**Nota**: Una vez instalado Node.js, podrás ejecutar todos los comandos npm del proyecto sin problemas.
