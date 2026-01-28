# 📸 Guía de Evidencia Funcional - InmobiCasita

Esta guía describe qué elementos funcionales debes verificar y documentar (en video o capturas) para demostrar que cumplen con los requisitos de la entrega.

## ✅ Requisitos Obligatorios a Demostrar

### 1. **Parte Pública - Accesible sin autenticación (20%)**

**Elementos a mostrar:**
- [ ] **Home/Inicio**: Página principal con información del negocio
  - Hero section con imagen de fondo
  - Sección "¿Por qué elegirnos?" con 4 tarjetas de características
  - CTA (Call-to-Action) para ir a propiedades
  
- [ ] **Página About**: Información de la empresa
  - Sección de historia
  - Misión y visión
  - Valores de la empresa
  - Contacto

- [ ] **Catálogo de Propiedades (Público)**: Listado de propiedades sin login
  - Búsqueda y filtros (ciudad, tipo de operación, estado)
  - Tarjetas de propiedades con imagen, precio, ubicación
  - Detalles de propiedad al hacer click
  - Paginación

- [ ] **Navegación**: Menú superior con links a Home, About, Propiedades

**Capturas obligatorias:**
- Pantalla de Home completa
- Página About
- Catálogo de propiedades (listado + detalles)

---

### 2. **Autenticación y Manejo de Sesión (20%)**

**Elementos a mostrar:**
- [ ] **Pantalla de Login**: 
  - Formulario con email y contraseña
  - Validación de campos (email válido, contraseña requerida)
  - Mensajes de error si credenciales son inválidas
  - Botón "Ingresar"
  - Link "¿No tienes cuenta?" (si existe registro)

- [ ] **Almacenamiento de Token**: 
  - Token guardado en localStorage después de login exitoso
  - Token adjuntado en cada request (verificable en DevTools Network)

- [ ] **Sesión activa**:
  - Usuario loggeado puede ver su email/nombre en el menú
  - Opción de Logout disponible

- [ ] **Logout**:
  - Al hacer logout, token se elimina
  - Usuario es redirigido a Home/Login
  - No puede acceder a rutas privadas

- [ ] **Rutas protegidas**:
  - Intentar acceder a `/admin` sin login redirige a `/login`
  - Después de login exitoso, accede a ruta privada correctamente

**Capturas obligatorias:**
- Pantalla de Login
- Dashboard/Panel después de loguearse (con usuario identificado)

---

### 3. **Control de Acceso por Roles y Restricciones (20%)**

**Elementos a mostrar (mínimo 2 restricciones diferentes):**

#### **Restricción 1: Menú diferente según rol**
- [ ] **Como ADMIN**: Ver menú con opciones:
  - Dashboard
  - Propietarios
  - Clientes
  - Inmuebles
  - Visitas
  - Contratos
  - Pagos
  - Roles
  
- [ ] **Como VENDEDOR**: Ver menú con opciones limitadas:
  - Dashboard (solo sus datos)
  - Mis Inmuebles
  - Mis Visitas
  - NO ve: Propietarios, Clientes, Contratos globales, Pagos, Roles

- [ ] **Como CLIENTE**: Ver menú limitado:
  - Mi cuenta/Perfil
  - Mis propiedades (las que compró/arrendó)
  - NO ve: Administración

#### **Restricción 2: Acciones bloqueadas por rol**
- [ ] **ADMIN puede**: Crear, editar, eliminar cualquier entidad
  
- [ ] **VENDEDOR puede**:
  - ✅ Crear sus propios inmuebles
  - ✅ Editar sus propios inmuebles
  - ❌ NO puede eliminar inmuebles
  - ❌ NO puede ver propietarios o clientes globales

- [ ] **CLIENTE**:
  - ✅ Ver catálogo de propiedades
  - ✅ Contactar vendedores
  - ✅ Solicitar compra/arriendo
  - ❌ NO puede crear inmuebles
  - ❌ NO puede acceder a /admin

#### **Restricción 3: Botones/opciones ocultas según rol**
- [ ] En tabla de inmuebles:
  - ADMIN ve: botones [Ver] [Editar] [Eliminar]
  - VENDEDOR ve: botones [Ver] [Editar] (sin Eliminar)
  - CLIENTE ve: solo [Ver]

**Capturas obligatorias:**
- Dashboard ADMIN
- Dashboard VENDEDOR (diferente del ADMIN)
- Intento de acción bloqueada (ej: VENDEDOR intentando eliminar - error visible)
- Tabla/listado mostrando opciones limitadas por rol

---

### 4. **Consumo de API y Módulos CRUD (25%)**

**Elementos a mostrar (mínimo 2 módulos funcionales):**

#### **Módulo 1: Inmuebles (Propiedades)**
- [ ] **Listado (READ)**:
  - Tabla/grid consumiendo API endpoint `/api/inmuebles/`
  - Muestra: código, título, ciudad, precio, estado
  - Filtros funcionando (búsqueda, ciudad, tipo operación, estado)
  - Paginación activa

- [ ] **Crear (CREATE)**:
  - Formulario completo para crear inmueble
  - Campos: título, descripción, ciudad, barrio, dirección, precio_venta, precio_arriendo, número habitaciones, baños, área
  - Validación: campos requeridos marcados, formatos correctos
  - POST a `/api/inmuebles/` exitoso
  - Mensaje de éxito mostrado
  - Inmueble aparece en listado

- [ ] **Editar (UPDATE)**:
  - Click en [Editar] abre formulario con datos precargados
  - Modificar un campo
  - PUT a `/api/inmuebles/{id}/` exitoso
  - Cambio reflejado en listado

- [ ] **Eliminar (DELETE)**:
  - Click en [Eliminar] muestra confirmación
  - DELETE a `/api/inmuebles/{id}/` exitoso
  - Inmueble desaparece del listado

- [ ] **Detalles/Vista (READ SINGLE)**:
  - Click en inmueble abre modal/página con todos los detalles
  - Información completa del inmueble

#### **Módulo 2: Visitas (Citas)**
- [ ] **Listado (READ)**:
  - Tabla con visitas consumiendo `/api/visitas/`
  - Muestra: fecha, inmueble, cliente, vendedor, estado

- [ ] **Crear (CREATE)**:
  - Formulario: seleccionar inmueble, fecha, hora, cliente, observaciones
  - POST a `/api/visitas/` exitoso
  - Visita aparece en listado

- [ ] **Cambiar Estado**:
  - Dropdown/select para cambiar estado (PENDIENTE → REALIZADA → CANCELADA)
  - PUT exitoso
  - Estado se refleja en tabla

#### **Módulo 3 (Opcional): Contratos**
- [ ] **Listado**: Tabla con contratos
- [ ] **Crear**: Formulario para crear contrato (compra/arriendo)
- [ ] **Ver detalles**: Información completa

**Capturas obligatorias:**
- Listado de una entidad (tabla mostrando datos de API)
- Formulario de creación (vacío)
- Formulario de creación (lleno, antes de guardar)
- Mensaje de éxito después de crear
- Listado actualizado (nueva entidad visible)
- Formulario de edición (datos precargados)
- Confirmación de eliminación (si aplica)

---

### 5. **Manejo de Estados, Validaciones y UX (10%)**

**Elementos a mostrar:**

- [ ] **Loader de carga**:
  - Al cargar listados: skeleton o spinner visible mientras se consume API
  - Desaparece cuando datos llegan

- [ ] **Mensajes de éxito**:
  - "Inmueble creado exitosamente" (al crear)
  - "Cambios guardados" (al editar)
  - "Elemento eliminado" (al eliminar)

- [ ] **Mensajes de error**:
  - "Email inválido" (en login)
  - "Campo requerido" (en formularios)
  - "Error al conectar con servidor" (conexión fallida)
  - Errores mostrados con claridad

- [ ] **Validaciones en formularios**:
  - Campo requerido sin valor: no permite guardar
  - Email sin formato válido: muestra error
  - Número negativo en precio: muestra error
  - Fecha en el pasado: muestra error (si aplica)

- [ ] **Interfaz responsive**:
  - En móvil: menú hamburguesa, cards apiladas, formularios adaptados
  - En tablet: layout intermedio
  - En desktop: layout completo

- [ ] **Estado "sin datos"**:
  - Cuando no hay resultados: "No se encontraron propiedades" con icono

**Capturas obligatorias:**
- Loader/spinner (en medio de carga)
- Mensaje de éxito (toast/alert)
- Mensaje de error (con validación)
- Vista móvil (menú hamburguesa, responsive)

---

## 🎬 Script del Video (3-5 minutos)

### **Minuto 0-0:30** - Introducción
- "Hola, soy [tu nombre]. Este es InmobiCasita, una plataforma de gestión inmobiliaria desarrollada con React y Django."
- Mostrar URL en navegador

### **Minuto 0:30-1:30** - Sección Pública
- Navega a Home: muestra hero, características, CTA
- Navega a About: muestra información
- Navega a Propiedades (sin login): muestra listado, filtros, detalles

### **Minuto 1:30-2:15** - Autenticación
- Click en "Ingresar" / Ir a Login
- Ingresa credenciales de ADMIN: admin@example.com / admin123
- Muestra login exitoso, redirige a dashboard
- Verifica token en DevTools (F12 > Application > localStorage)

### **Minuto 2:15-3:00** - Control por Roles y Restricciones
- Muestra menú ADMIN (opciones completas)
- **Cambiar credenciales**: Logout
- Login como VENDEDOR: vendedor@example.com / vendedor123
- Muestra menú VENDEDOR (opciones limitadas)
- Intenta hacer algo restringido (ej: eliminar un inmueble): muestra error o botón deshabilitado
- Logout

### **Minuto 3:00-4:30** - Consumo de API y CRUD
- Login como ADMIN nuevamente
- Ve a módulo Inmuebles:
  - Muestra listado consumiendo API
  - Abre detalles de uno
  - Hace click en Crear nuevo:
    - Rellena formulario
    - Valida campos (muestra error si deja en blanco)
    - Guarda
    - Muestra mensaje de éxito
    - Nuevo inmueble aparece en listado
- Ve a Visitas:
  - Muestra listado
  - Crea una nueva visita
  - Muestra confirmación

### **Minuto 4:30-5:00** - Conclusión
- "El sistema cumple con autenticación, control de roles, y consumo real de API REST desde Django. Gracias."
- Pantalla final con datos del proyecto

---

## 📋 Checklist de Captura de Pantallas

Crea un PDF con estas capturas obligatorias:

```
EVIDENCIA VISUAL - InmobiCasita

1. PÁGINA PÚBLICA
   - Home completo (hero + características + CTA)
   - About
   - Catálogo de propiedades

2. AUTENTICACIÓN
   - Pantalla de Login
   - Dashboard después de login (usuario identificado)

3. CONTROL DE ROLES
   - Menú ADMIN
   - Menú VENDEDOR (diferente)
   - Acción bloqueada para rol sin permiso

4. CONSUMO DE API
   - Listado de inmuebles (tabla con datos)
   - Crear inmueble: formulario completo
   - Crear inmueble: validación de error
   - Crear inmueble: mensaje de éxito
   - Crear inmueble: nuevo en listado
   - Editar inmueble: formulario precargado
   - Listado de visitas

5. VALIDACIONES Y UX
   - Loader/Spinner
   - Mensaje de éxito (toast)
   - Mensaje de error
   - Vista responsive (móvil)

Total: ~25-30 capturas
```

---

## 🧪 Checklist Completo

Antes de entregar, verifica:

- [ ] Home, About, Propiedades públicas funcionan sin login
- [ ] Login con credenciales correctas e incorrectas funciona
- [ ] Token se guarda en localStorage
- [ ] Logout elimina token y redirige
- [ ] No se puede acceder a /admin sin estar loggeado
- [ ] Menú diferente según rol (ADMIN vs VENDEDOR vs CLIENTE)
- [ ] Restricciones de permisos funcionan (no ve botones/opciones restrictas)
- [ ] Listados consumen API real (verificar Network en DevTools)
- [ ] Crear funciona: formulario → POST → éxito → lista actualizada
- [ ] Editar funciona: datos precargados → PUT → éxito → lista actualizada
- [ ] Eliminar funciona: confirmación → DELETE → éxito → desaparece de lista
- [ ] Validaciones muestran errores claros
- [ ] Loaders visibles mientras cargan datos
- [ ] Mensajes de éxito/error visibles
- [ ] Interfaz responsive (móvil, tablet, desktop)
- [ ] README tiene credenciales de prueba
- [ ] GitHub tiene el código fuente
- [ ] Video 3-5 minutos mostrando todo lo anterior

---

## 📹 Cómo Grabar el Video

**Recomendación**: Usa OBS Studio (gratis)

1. Abre OBS Studio
2. Configura pantalla como fuente
3. Configura audio del micrófono
4. Comienza grabación
5. Sigue el script anterior
6. Termina grabación
7. Exporta como MP4

**Alternativas**:
- Loom (gratuito, en línea)
- ScreenFlow (Mac)
- CapCut (gratis, sencillo)

---

## 📧 Entrega Final

Entrega al profesor:
- Link a GitHub (código fuente + README)
- Video (MP4) con evidence
- PDF con capturas obligatorias
- Documento de despliegue CI/CD (si aplica)

