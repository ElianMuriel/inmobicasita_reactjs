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
import { visitasService, inmueblesService, clientesService } from '../../services/resourceService'
import { format } from 'date-fns'
import DataTable from '../../components/DataTable'

function Visitas() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [inmuebles, setInmuebles] = useState([])
  const [clientes, setClientes] = useState([])
  const [formData, setFormData] = useState({
    inmueble: '',
    cliente: '',
    fecha_hora: '',
    comentarios: '',
    estado: 'PROGRAMADA',
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
    remove,
    updateFilters,
    changePage,
  } = useResource(visitasService, { search: '' })

  useEffect(() => {
    loadRelatedData()
  }, [])

  const loadRelatedData = async () => {
    try {
      const [inmueblesRes, clientesRes] = await Promise.all([
        inmueblesService.getAll(),
        clientesService.getAll(),
      ])
      setInmuebles(inmueblesRes.data.results || inmueblesRes.data)
      setClientes(clientesRes.data.results || clientesRes.data)
    } catch (err) {
      console.error('Error loading related data:', err)
    }
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      const fechaHora = item.fecha_hora
        ? format(new Date(item.fecha_hora), "yyyy-MM-dd'T'HH:mm")
        : ''
      setFormData({
        inmueble: typeof item.inmueble === 'object' ? item.inmueble.id : item.inmueble,
        cliente: typeof item.cliente === 'object' ? item.cliente.id : item.cliente,
        fecha_hora: fechaHora,
        comentarios: item.comentarios || '',
        estado: item.estado || 'PROGRAMADA',
      })
    } else {
      setEditingItem(null)
      setFormData({
        inmueble: '',
        cliente: '',
        fecha_hora: '',
        comentarios: '',
        estado: 'PROGRAMADA',
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
      ...formData,
      inmueble: parseInt(formData.inmueble),
      cliente: parseInt(formData.cliente),
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

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de eliminar esta visita?')) {
      const result = await remove(item.id)
      if (!result.success) {
        alert('Error al eliminar: ' + (result.error?.detail || 'Error desconocido'))
      }
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'inmueble',
      label: 'Inmueble',
      render: (value) => (typeof value === 'object' ? value?.titulo : value),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (value) =>
        typeof value === 'object'
          ? `${value?.nombres} ${value?.apellidos}`
          : value,
    },
    {
      key: 'fecha_hora',
      label: 'Fecha y Hora',
      render: (value) => (value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '-'),
    },
    { key: 'estado', label: 'Estado' },
  ]

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Visitas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nueva Visita
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar visitas..."
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
        onDelete={handleDelete}
      />

      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={(event, value) => changePage(value)}
            color="primary"
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
          {editingItem ? 'Editar Visita' : 'Nueva Visita'}
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
                  <InputLabel>Inmueble</InputLabel>
                  <Select
                    value={formData.inmueble}
                    onChange={(e) => setFormData({ ...formData, inmueble: e.target.value })}
                    label="Inmueble"
                  >
                    {inmuebles.map((inm) => (
                      <MenuItem key={inm.id} value={inm.id}>
                        {inm.codigo_interno} - {inm.titulo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Cliente</InputLabel>
                  <Select
                    value={formData.cliente}
                    onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                    label="Cliente"
                  >
                    {clientes.map((cli) => (
                      <MenuItem key={cli.id} value={cli.id}>
                        {cli.nombres} {cli.apellidos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Fecha y Hora"
                  value={formData.fecha_hora}
                  onChange={(e) => setFormData({ ...formData, fecha_hora: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    label="Estado"
                  >
                    <MenuItem value="PROGRAMADA">Programada</MenuItem>
                    <MenuItem value="REALIZADA">Realizada</MenuItem>
                    <MenuItem value="CANCELADA">Cancelada</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comentarios"
                  value={formData.comentarios}
                  onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                />
              </Grid>
            </Grid>

            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  )
}

export default Visitas
