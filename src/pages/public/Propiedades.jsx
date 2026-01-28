import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BedIcon from '@mui/icons-material/Bed'
import BathroomIcon from '@mui/icons-material/Bathroom'
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { inmueblesService, visitasService, contratosService } from '../../services/resourceService'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Propiedades() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  
  const placeholderImages = [
    'https://images.unsplash.com/photo-1523217311519-fef6f8c91b0b?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop',
  ]
  
  const getPlaceholderImage = (index) => {
    return placeholderImages[index % placeholderImages.length]
  }
  
  const [inmuebles, setInmuebles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedInmueble, setSelectedInmueble] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [actionType, setActionType] = useState(null)
  const [formData, setFormData] = useState({
    mensaje: '',
    fecha_visita: '',
  })
  const [filters, setFilters] = useState({
    search: '',
    tipo_operacion: '',
    estado: '',
    ciudad: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    count: 0,
    totalPages: 0,
  })

  useEffect(() => {
    loadInmuebles()
  }, [pagination.page, filters])

  const loadInmuebles = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        ...filters,
      }
      const response = await inmueblesService.getAll(params)
      setInmuebles(response.data.results || response.data)
      if (response.data.count !== undefined) {
        setPagination(prev => ({
          ...prev,
          count: response.data.count,
          totalPages: Math.ceil(response.data.count / pagination.pageSize),
        }))
      }
      setError(null)
    } catch (err) {
      setError('Error al cargar las propiedades')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const formatPrice = (price) => {
    if (!price) return 'Consultar'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const getEstadoChip = (estado) => {
    const estados = {
      DISPONIBLE: { color: 'success', label: 'Disponible' },
      RESERVADO: { color: 'warning', label: 'Reservado' },
      VENDIDO: { color: 'error', label: 'Vendido' },
      ARRENDADO: { color: 'info', label: 'Arrendado' },
      INACTIVO: { color: 'default', label: 'Inactivo' },
    }
    return estados[estado] || { color: 'default', label: estado }
  }

  const handleViewProperty = (inmueble) => {
    setSelectedInmueble(inmueble)
    setModalOpen(true)
    setActionType('ver')
  }

  const handleContactar = (inmueble) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSelectedInmueble(inmueble)
    setActionType('contactar')
    setFormData({ mensaje: '', fecha_visita: '' })
    setModalOpen(true)
  }

  const handleComprar = (inmueble) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setSelectedInmueble(inmueble)
    setActionType('comprar')
    setFormData({ mensaje: '', fecha_visita: '' })
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedInmueble(null)
    setActionType(null)
    setFormData({ mensaje: '', fecha_visita: '' })
  }

  const handleSubmitContactar = async (e) => {
    e.preventDefault()
    if (!selectedInmueble) return

    try {
      let clienteId = null
      try {
        const { profileService } = await import('../../services/resourceService')
        const clienteRes = await profileService.getMiCliente()
        clienteId = clienteRes.data.id
      } catch (err) {
        console.error('Error obteniendo cliente:', err)
        alert('Error: No se encontró tu perfil de cliente. Por favor, regístrate primero.')
        return
      }

      const visitaData = {
        inmueble: selectedInmueble.id,
        cliente: clienteId,
        fecha_hora: formData.fecha_visita || new Date().toISOString(),
        comentarios: formData.mensaje || 'Cliente interesado en la propiedad',
        estado: 'PROGRAMADA',
      }

      await visitasService.create(visitaData)
      alert('Tu solicitud de contacto ha sido enviada. Un vendedor se pondrá en contacto contigo pronto.')
      handleCloseModal()
    } catch (err) {
      alert('Error al enviar la solicitud: ' + (err.response?.data?.detail || 'Error desconocido'))
    }
  }

  const handleSubmitComprar = async (e) => {
    e.preventDefault()
    if (!selectedInmueble) return

    if (!window.confirm(`¿Estás seguro de que deseas ${selectedInmueble.tipo_operacion === 'ARRIENDO' ? 'arrendar' : 'comprar'} esta propiedad?`)) {
      return
    }

    try {
      let clienteId = null
      try {
        const { profileService } = await import('../../services/resourceService')
        const clienteRes = await profileService.getMiCliente()
        clienteId = clienteRes.data.id
      } catch (err) {
        console.error('Error obteniendo cliente:', err)
        alert('Error: No se encontró tu perfil de cliente. Por favor, regístrate primero.')
        return
      }

      const contratoData = {
        inmueble: selectedInmueble.id,
        cliente: clienteId,
        tipo_contrato: selectedInmueble.tipo_operacion === 'ARRIENDO' ? 'ARRENDAMIENTO' : 'VENTA',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: null,
        valor_total: selectedInmueble.tipo_operacion === 'ARRIENDO' 
          ? selectedInmueble.precio_arriendo 
          : selectedInmueble.precio_venta,
        estado: 'ACTIVO',
        observaciones: 'Solicitud de compra/arriendo desde el frontend',
      }

      await contratosService.create(contratoData)
      alert(`¡Felicidades! Has ${selectedInmueble.tipo_operacion === 'ARRIENDO' ? 'arrendado' : 'comprado'} la propiedad. Un vendedor se pondrá en contacto contigo para finalizar el proceso.`)
      handleCloseModal()
      loadInmuebles()
    } catch (err) {
      alert('Error al procesar la compra: ' + (err.response?.data?.detail || 'Error desconocido'))
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1523217311519-fef6f8c91b0b?w=1400&h=500&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' },
          color: 'white',
          py: 8,
          position: 'relative',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(26, 58, 58, 0.65)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="overline" 
              sx={{ 
                fontSize: '0.875rem', 
                color: 'secondary.main', 
                display: 'block', 
                mb: 1,
                fontWeight: 600
              }}
            >
              Propiedades cuidadosamente seleccionadas
            </Typography>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              Nuestras Mejores Ofertas
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.95,
                maxWidth: '600px',
                mx: 'auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                fontWeight: 300
              }}
            >
              Encuentra la propiedad ideal para ti entre nuestras opciones más destacadas
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Título, código o ciudad..."
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Operación</InputLabel>
              <Select
                name="tipo_operacion"
                value={filters.tipo_operacion}
                onChange={handleFilterChange}
                label="Tipo de Operación"
              >
                <MenuItem value="">Todas las operaciones</MenuItem>
                <MenuItem value="VENTA">Venta</MenuItem>
                <MenuItem value="ARRIENDO">Arriendo</MenuItem>
                <MenuItem value="AMBOS">Venta y Arriendo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={filters.estado}
                onChange={handleFilterChange}
                label="Estado"
              >
                <MenuItem value="">Todos los estados</MenuItem>
                <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                <MenuItem value="RESERVADO">Reservado</MenuItem>
                <MenuItem value="VENDIDO">Vendido</MenuItem>
                <MenuItem value="ARRENDADO">Arrendado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

        {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : inmuebles.length === 0 ? (
        <Alert severity="info">No se encontraron propiedades</Alert>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {inmuebles.map((inmueble) => {
              const estadoChip = getEstadoChip(inmueble.estado)
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={inmueble.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardMedia
                      sx={{
                        height: 240,
                        bgcolor: 'grey.200',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundImage: inmueble.imagen 
                          ? `url(${inmueble.imagen})`
                          : `url(${getPlaceholderImage(inmueble.id)})`,
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onClick={() => handleViewProperty(inmueble)}
                    >
                      {!inmueble.imagen && !getPlaceholderImage(inmueble.id) && 
                        <HomeIcon sx={{ fontSize: 80, color: 'grey.400' }} />
                      }
                      <Chip
                        label={estadoChip.label}
                        color={estadoChip.color}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </CardMedia>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                        {inmueble.titulo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Código: {inmueble.codigo_interno}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
                        <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
                        <Typography variant="body2">
                          {inmueble.ciudad} {inmueble.barrio && `- ${inmueble.barrio}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {inmueble.numero_habitaciones}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BathroomIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {inmueble.numero_banos}
                          </Typography>
                        </Box>
                        {inmueble.area_m2 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <SquareFootIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {inmueble.area_m2} m²
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        {inmueble.tipo_operacion === 'VENTA' || inmueble.tipo_operacion === 'AMBOS' ? (
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                            {formatPrice(inmueble.precio_venta)}
                          </Typography>
                        ) : null}
                        {inmueble.tipo_operacion === 'ARRIENDO' || inmueble.tipo_operacion === 'AMBOS' ? (
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                            {formatPrice(inmueble.precio_arriendo)}/mes
                          </Typography>
                        ) : null}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewProperty(inmueble)}
                      >
                        Ver Propiedad
                      </Button>
                      {isAuthenticated && (
                        <>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            startIcon={<ContactMailIcon />}
                            onClick={() => handleContactar(inmueble)}
                          >
                            Contactar
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleComprar(inmueble)}
                          >
                            {inmueble.tipo_operacion === 'ARRIENDO' ? 'Arrendar' : 'Comprar'}
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(event, value) => setPagination(prev => ({ ...prev, page: value }))}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {actionType === 'ver' ? 'Detalles de la Propiedad' :
           actionType === 'contactar' ? 'Contactar Vendedor' :
           actionType === 'comprar' ? `${selectedInmueble?.tipo_operacion === 'ARRIENDO' ? 'Arrendar' : 'Comprar'} Propiedad` :
           'Propiedad'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'ver' && selectedInmueble && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedInmueble.titulo}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Código:</strong> {selectedInmueble.codigo_interno}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Descripción:</strong> {selectedInmueble.descripcion || 'Sin descripción'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Dirección:</strong> {selectedInmueble.direccion}, {selectedInmueble.ciudad}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Habitaciones:</strong> {selectedInmueble.numero_habitaciones}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Baños:</strong> {selectedInmueble.numero_banos}
              </Typography>
              {selectedInmueble.area_m2 && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Área:</strong> {selectedInmueble.area_m2} m²
                </Typography>
              )}
              <Box>
                {selectedInmueble.tipo_operacion === 'VENTA' || selectedInmueble.tipo_operacion === 'AMBOS' ? (
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    <strong>Precio Venta:</strong> {formatPrice(selectedInmueble.precio_venta)}
                  </Typography>
                ) : null}
                {selectedInmueble.tipo_operacion === 'ARRIENDO' || selectedInmueble.tipo_operacion === 'AMBOS' ? (
                  <Typography variant="h6">
                    <strong>Precio Arriendo:</strong> {formatPrice(selectedInmueble.precio_arriendo)}/mes
                  </Typography>
                ) : null}
              </Box>
            </Box>
          )}

          {actionType === 'contactar' && selectedInmueble && (
            <Box component="form" onSubmit={handleSubmitContactar}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Estás interesado en: <strong>{selectedInmueble.titulo}</strong>
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                label="Fecha preferida para visita (opcional)"
                value={formData.fecha_visita}
                onChange={(e) => setFormData({ ...formData, fecha_visita: e.target.value })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Mensaje para el vendedor (opcional)"
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                margin="normal"
                placeholder="Escribe un mensaje..."
              />
              <DialogActions>
                <Button onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit" variant="contained" color="primary">
                  Enviar Solicitud
                </Button>
              </DialogActions>
            </Box>
          )}

          {actionType === 'comprar' && selectedInmueble && (
            <Box component="form" onSubmit={handleSubmitComprar}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Estás a punto de {selectedInmueble.tipo_operacion === 'ARRIENDO' ? 'arrendar' : 'comprar'}:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                {selectedInmueble.titulo}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3 }}>
                <strong>Precio:</strong> {
                  selectedInmueble.tipo_operacion === 'ARRIENDO' 
                    ? formatPrice(selectedInmueble.precio_arriendo) + '/mes'
                    : formatPrice(selectedInmueble.precio_venta)
                }
              </Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                Esta acción creará una solicitud de {selectedInmueble.tipo_operacion === 'ARRIENDO' ? 'arriendo' : 'compra'}. 
                Un vendedor se pondrá en contacto contigo para finalizar el proceso.
              </Alert>
              <DialogActions>
                <Button onClick={handleCloseModal}>Cancelar</Button>
                <Button type="submit" variant="contained" color="secondary">
                  {selectedInmueble.tipo_operacion === 'ARRIENDO' ? 'Arrendar' : 'Comprar'}
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      </Container>
    </Box>
  )
}

export default Propiedades
