# Solución: Error de Política de Ejecución en PowerShell

## 🚨 Problema
```
npm : No se puede cargar el archivo ... porque la ejecución de scripts está deshabilitada
```

## ✅ Solución Rápida

### Opción 1: Cambiar Política para la Sesión Actual (Temporal)

Ejecuta en PowerShell (como Administrador):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Luego verifica:
```powershell
Get-ExecutionPolicy
```

Debería mostrar: `RemoteSigned`

### Opción 2: Cambiar Política para el Usuario Actual (Permanente)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Opción 3: Ejecutar PowerShell como Administrador

1. Cierra PowerShell actual
2. Busca "PowerShell" en el menú inicio
3. **Clic derecho** → **"Ejecutar como administrador"**
4. Ejecuta:
   ```powershell
   Set-ExecutionPolicy RemoteSigned
   ```
5. Responde **Y** (Yes) cuando pregunte

## 🔍 Verificar Política Actual

```powershell
Get-ExecutionPolicy -List
```

## 📝 Explicación de Políticas

- **Restricted**: No permite ejecutar scripts (por defecto en algunos sistemas)
- **RemoteSigned**: Permite scripts locales y scripts remotos firmados (recomendado)
- **Unrestricted**: Permite todos los scripts (menos seguro)

**Recomendación**: Usa `RemoteSigned` para desarrollo.

## ✅ Después de Cambiar la Política

1. Cierra y reabre PowerShell
2. Verifica que funciona:
   ```powershell
   npm --version
   ```
3. Instala dependencias:
   ```powershell
   cd frontend
   npm install
   ```

## ⚠️ Si No Puedes Cambiar la Política

### Alternativa: Usar CMD en lugar de PowerShell

1. Abre **CMD** (Símbolo del sistema) en lugar de PowerShell
2. Navega al directorio:
   ```cmd
   cd D:\Carlos\Desktop\inmobicasita_api\frontend
   ```
3. Ejecuta:
   ```cmd
   npm install
   ```

CMD no tiene estas restricciones de política de ejecución.

## 🔒 Seguridad

La política `RemoteSigned` es segura porque:
- Permite ejecutar scripts locales (como los de npm)
- Requiere que scripts descargados de internet estén firmados
- Es la configuración recomendada por Microsoft para desarrollo

---

**Nota**: Si trabajas en una computadora corporativa, es posible que necesites permisos de administrador o contactar al departamento de TI.
