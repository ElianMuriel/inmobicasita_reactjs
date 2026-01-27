import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        const userData = authService.getUser()
        // El rol ya viene del token, no necesitamos verificarlo de nuevo
        setUser(userData)
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (username, password) => {
    try {
      const { user: userData } = await authService.login(username, password)
      // El rol ya viene del token con los claims personalizados
      setUser(userData)
      return { success: true, user: userData }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Error al iniciar sesión',
      }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // Funciones helper para verificar roles
  const isAdmin = () => user?.rol === 'ADMIN' || user?.is_staff === true
  const isVendedor = () => user?.rol === 'VENDEDOR' || user?.is_vendedor === true
  const isCliente = () => user?.rol === 'CLIENTE' || user?.is_cliente === true || (!isAdmin() && !isVendedor())
  const canDelete = () => isAdmin() // Solo admin puede eliminar
  const canCreateInmuebles = () => isAdmin() || isVendedor() // Admin y vendedor pueden crear
  const canManageVisitas = () => isAdmin() || isVendedor() // Admin y vendedor pueden gestionar visitas

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: isAdmin(),
    isVendedor: isVendedor(),
    isCliente: isCliente(),
    canDelete,
    canCreateInmuebles,
    canManageVisitas,
    userRole: user?.rol || 'CLIENTE',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
