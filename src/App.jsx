import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import VendedorLayout from './components/VendedorLayout'
import ClienteLayout from './components/ClienteLayout'
import PublicLayout from './components/PublicLayout'
import Home from './pages/public/Home'
import About from './pages/public/About'
import Propiedades from './pages/public/Propiedades'
import Login from './pages/auth/Login'
import Dashboard from './pages/admin/Dashboard'
import Propietarios from './pages/admin/Propietarios'
import Clientes from './pages/admin/Clientes'
import Inmuebles from './pages/admin/Inmuebles'
import TiposInmueble from './pages/admin/TiposInmueble'
import Visitas from './pages/admin/Visitas'
import Contratos from './pages/admin/Contratos'
import Pagos from './pages/admin/Pagos'
import Roles from './pages/admin/Roles'
import VendedorDashboard from './pages/vendedor/Dashboard'
import InmueblesVendedor from './pages/vendedor/InmueblesVendedor'
import VisitasVendedor from './pages/vendedor/VisitasVendedor'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }
  
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (!isAdmin) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos de administrador para acceder a esta sección.</p>
    </div>
  }
  
  return children
}

function VendedorRoute({ children }) {
  const { user, loading, isVendedor, isAdmin } = useAuth()
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (!isVendedor && !isAdmin) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos de vendedor para acceder a esta sección.</p>
    </div>
  }
  
  return children
}

function ClienteRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth()
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return children
}

function RoleRedirect() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }
  
  if (user.rol === 'ADMIN' || user.is_staff) {
    return <Navigate to="/admin" />
  } else if (user.rol === 'VENDEDOR') {
    return <Navigate to="/vendedor" />
  } else {
    return <Navigate to="/" />
  }
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="propiedades" element={<Propiedades />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="/admin" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="propietarios" element={<AdminRoute><Propietarios /></AdminRoute>} />
          <Route path="clientes" element={<AdminRoute><Clientes /></AdminRoute>} />
          <Route path="inmuebles" element={<AdminRoute><Inmuebles /></AdminRoute>} />
          <Route path="tipos-inmueble" element={<AdminRoute><TiposInmueble /></AdminRoute>} />
          <Route path="visitas" element={<AdminRoute><Visitas /></AdminRoute>} />
          <Route path="contratos" element={<AdminRoute><Contratos /></AdminRoute>} />
          <Route path="pagos" element={<AdminRoute><Pagos /></AdminRoute>} />
          <Route path="roles" element={<AdminRoute><Roles /></AdminRoute>} />
        </Route>
        <Route path="/vendedor" element={<PrivateRoute><VendedorLayout /></PrivateRoute>}>
          <Route index element={<VendedorRoute><VendedorDashboard /></VendedorRoute>} />
          <Route path="inmuebles" element={<VendedorRoute><InmueblesVendedor /></VendedorRoute>} />
          <Route path="visitas" element={<VendedorRoute><VisitasVendedor /></VendedorRoute>} />
        </Route>
        <Route path="/cliente" element={<PrivateRoute><ClienteLayout /></PrivateRoute>}>
          <Route index element={<ClienteRoute><div><h1>Área de Cliente</h1><p>Bienvenido, aquí puedes ver tus propiedades y contactos.</p></div></ClienteRoute>} />
          <Route path="mis-propiedades" element={<ClienteRoute><div><h1>Mis Propiedades</h1><p>Propiedades que has adquirido o reservado.</p></div></ClienteRoute>} />
          <Route path="contactos" element={<ClienteRoute><div><h1>Contactos</h1><p>Mensajes con vendedores.</p></div></ClienteRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
