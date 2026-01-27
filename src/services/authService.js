import api from './api'
import axios from 'axios'
import API_BASE_URL from '../config/api'

export const authService = {
  async login(username, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
      username,
      password,
    })
    const { access, refresh } = response.data
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    
    // Obtener información del usuario desde el token
    // El backend ahora incluye: user_id, username, is_staff, is_vendedor, is_cliente, cliente_id
    try {
      const tokenParts = access.split('.')
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]))
        
        // Debug: ver qué contiene el token
        console.log('Token payload completo:', payload)
        console.log('is_vendedor en token:', payload.is_vendedor, typeof payload.is_vendedor)
        
        // Determinar el rol del usuario basado en los claims del token
        let rol = 'CLIENTE' // Por defecto
        if (payload.is_staff === true || payload.is_staff === 'true') {
          rol = 'ADMIN'
        } else if (payload.is_vendedor === true || payload.is_vendedor === 'true') {
          rol = 'VENDEDOR'
        } else if (payload.is_cliente === true || payload.is_cliente === 'true') {
          rol = 'CLIENTE'
        }
        
        console.log('Rol determinado:', rol)
        
        const userData = {
          username: payload.username || username,
          is_staff: payload.is_staff === true || payload.is_staff === 'true',
          user_id: payload.user_id || payload.user_id,
          is_vendedor: payload.is_vendedor === true || payload.is_vendedor === 'true',
          is_cliente: payload.is_cliente === true || payload.is_cliente === 'true',
          cliente_id: payload.cliente_id || null,
          rol: rol,
          email: payload.email || null,
          first_name: payload.first_name || null,
          last_name: payload.last_name || null,
        }
        localStorage.setItem('user', JSON.stringify(userData))
        return { access, refresh, user: userData }
      }
    } catch (e) {
      console.error('Error decoding token:', e)
    }
    
    // Fallback si no se puede decodificar
    const userData = { 
      username, 
      is_staff: false, 
      is_vendedor: false,
      is_cliente: false,
      cliente_id: null,
      rol: 'CLIENTE', 
      user_id: null 
    }
    localStorage.setItem('user', JSON.stringify(userData))
    return { access, refresh, user: userData }
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  getToken() {
    return localStorage.getItem('access_token')
  },

  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated() {
    return !!this.getToken()
  },
}
