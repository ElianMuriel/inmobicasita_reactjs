import api from './api'

const createResourceService = (endpoint) => ({
  getAll: (params = {}) => {
    return api.get(`/${endpoint}/`, { params })
  },

  getById: (id) => {
    return api.get(`/${endpoint}/${id}/`)
  },

  create: (data) => {
    return api.post(`/${endpoint}/`, data)
  },

  update: (id, data) => {
    return api.put(`/${endpoint}/${id}/`, data)
  },

  patch: (id, data) => {
    return api.patch(`/${endpoint}/${id}/`, data)
  },

  delete: (id) => {
    return api.delete(`/${endpoint}/${id}/`)
  },
})

export const propietariosService = createResourceService('propietarios')
export const clientesService = createResourceService('clientes')
export const inmueblesService = createResourceService('inmuebles')
export const tiposInmuebleService = createResourceService('tipos-inmueble')
export const visitasService = createResourceService('visitas')
export const contratosService = createResourceService('contratos')
export const pagosService = createResourceService('pagos')
export const rolesService = createResourceService('roles')

// Servicio para obtener el perfil del usuario actual
export const profileService = {
  getProfile: () => api.get('/profile/'),
  getMiCliente: () => api.get('/auth/mi-cliente/'), // Endpoint que necesitas crear en el backend
}