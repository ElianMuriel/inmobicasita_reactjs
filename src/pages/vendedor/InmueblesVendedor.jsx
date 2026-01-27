import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useResource } from '../../hooks/useResource'
import { useAuth } from '../../contexts/AuthContext'
import { inmueblesService, tiposInmuebleService, propietariosService } from '../../services/resourceService'
import DataTable from '../../components/DataTable'

function InmueblesVendedor() {
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [tiposInmueble, setTiposInmueble] = useState([])
  const [propietarios, setPropietarios] = useState([])
  const [formData, setFormData] = useState({
    tipo: '',
    propietario: '',
    titulo: '',
    descripcion: '',
    direccion: '',
    ciudad: '',
    barrio: '',
    tipo_operacion: 'VENTA',
    precio_venta: '',
    precio_arriendo: '',
    numero_habitaciones: 0,
    numero_banos: 0,
    area_m2: '',
    estado: 'DISPONIBLE',
  })
  const [formError, setFormError] = useState('')

  const {
    data,
    loading,
    error,
    filters,
    pagination,
    create,
    update,
    updateFilters,
    changePage,
  } = useResource(inmueblesService, { search: '', usuario: user?.user_id })

  useEffect(() => {
    loadRelatedData()
  }, [])

  const loadRelatedData = async () => {
    try {
      const [tiposRes, propietariosRes] = await Promise.all([
        tiposInmuebleService.getAll(),
        propietariosService.getAll(),
      ])
      setTiposInmueble(tiposRes.data.results || tiposRes.data)
      setPropietarios(propietariosRes.data.results || propietariosRes.data)
    } catch (err) {
      console.error('Error loading related data:', err)
    }
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        tipo: typeof item.tipo === 'object' ? item.tipo.id : item.tipo || '',
        propietario: typeof item.propietario === 'object' ? item.propietario.id : item.propietario || '',
        titulo: item.titulo || '',
        descripcion: item.descripcion || '',
        direccion: item.direccion || '',
        ciudad: item.ciudad || '',
        barrio: item.barrio || '',
        tipo_operacion: item.tipo_operacion || 'VENTA',
        precio_venta: item.precio_venta || '',
        precio_arriendo: item.precio_arriendo || '',
        numero_habitaciones: item.numero_habitaciones || 0,
        numero_banos: item.numero_banos || 0,
        area_m2: item.area_m2 || '',
        estado: item.estado || 'DISPONIBLE',
      })
    } else {
      setEditingItem(null)
      setFormData({
        tipo: '',
        propietario: '',
        titulo: '',
        descripcion: '',
        direccion: '',
        ciudad: '',
        barrio: '',
        tipo_operacion: 'VENTA',
        precio_venta: '',
        precio_arriendo: '',
        numero_habitaciones: 0,
        numero_banos: 0,
        area_m2: '',
        estado: 'DISPONIBLE',
      })
    }
    setFormError('')
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingItem(null)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const submitData = {
      tipo: parseInt(formData.tipo),
      propietario: parseInt(formData.propietario),
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      barrio: formData.barrio,
      tipo_operacion: formData.tipo_operacion,
      usuario: user?.user_id,
      precio_venta: formData.precio_venta ? parseFloat(formData.precio_venta) : null,
      precio_arriendo: formData.precio_arriendo ? parseFloat(formData.precio_arriendo) : null,
      area_m2: formData.area_m2 ? parseFloat(formData.area_m2) : null,
      numero_habitaciones: parseInt(formData.numero_habitaciones),
      numero_banos: parseInt(formData.numero_banos),
      estado: formData.estado,
    }
    
    if (editingItem) {
      submitData.codigo_interno = editingItem.codigo_interno
    }

    const result = editingItem
      ? await update(editingItem.id, submitData)
      : await create(submitData)

    if (result.success) {
      handleCloseModal()
    } else {
      setFormError(
        result.error?.detail ||
          Object.values(result.error || {}).flat().join(', ') ||
          'Error al guardar'
      )
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'codigo_interno', label: 'Código' },
    { key: 'titulo', label: 'Título' },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (typeof value === 'object' ? value?.nombre_tipo : value),
    },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'tipo_operacion', label: 'Operación' },
    { key: 'estado', label: 'Estado' },
  ]

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Mis Inmuebles
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Inmueble
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar inmuebles..."
          value={filters.search || ''}
          onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
          variant="outlined"
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        onEdit={handleOpenModal}
        onDelete={null}
      />

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(event, value) => changePage(value)}
            color="secondary"
            size="large"
          />
        </Box>
      )}

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Editar Inmueble' : 'Nuevo Inmueble'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Inmueble</InputLabel>
                  <Select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    label="Tipo de Inmueble"
                  >
                    {tiposInmueble.map((tipo) => (
                      <MenuItem key={tipo.id} value={tipo.id}>
                        {tipo.nombre_tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Propietario</InputLabel>
                  <Select
                    value={formData.propietario}
                    onChange={(e) => setFormData({ ...formData, propietario: e.target.value })}
                    label="Propietario"
                  >
                    {propietarios.map((prop) => (
                      <MenuItem key={prop.id} value={prop.id}>
                        {prop.nombres} {prop.apellidos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Barrio"
                  value={formData.barrio}
                  onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Operación</InputLabel>
                  <Select
                    value={formData.tipo_operacion}
                    onChange={(e) => setFormData({ ...formData, tipo_operacion: e.target.value })}
                    label="Tipo de Operación"
                  >
                    <MenuItem value="VENTA">Venta</MenuItem>
                    <MenuItem value="ARRIENDO">Arriendo</MenuItem>
                    <MenuItem value="AMBOS">Venta y Arriendo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio Venta"
                  value={formData.precio_venta}
                  onChange={(e) => setFormData({ ...formData, precio_venta: e.target.value })}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Precio Arriendo"
                  value={formData.precio_arriendo}
                  onChange={(e) => setFormData({ ...formData, precio_arriendo: e.target.value })}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Habitaciones"
                  value={formData.numero_habitaciones}
                  onChange={(e) => setFormData({ ...formData, numero_habitaciones: e.target.value })}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Baños"
                  value={formData.numero_banos}
                  onChange={(e) => setFormData({ ...formData, numero_banos: e.target.value })}
                  inputProps={{ min: 0 }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Área (m²)"
                  value={formData.area_m2}
                  onChange={(e) => setFormData({ ...formData, area_m2: e.target.value })}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="DISPONIBLE">Disponible</MenuItem>
                    <MenuItem value="RESERVADO">Reservado</MenuItem>
                    <MenuItem value="VENDIDO">Vendido</MenuItem>
                    <MenuItem value="ARRENDADO">Arrendado</MenuItem>
                    <MenuItem value="INACTIVO">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="secondary">
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default InmueblesVendedor
