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
import { contratosService, inmueblesService, clientesService } from '../../services/resourceService'
import { format } from 'date-fns'
import DataTable from '../../components/DataTable'

function Contratos() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [inmuebles, setInmuebles] = useState([])
  const [clientes, setClientes] = useState([])
  const [formData, setFormData] = useState({
    inmueble: '',
    cliente: '',
    tipo_contrato: 'VENTA',
    fecha_inicio: '',
    fecha_fin: '',
    valor_total: '',
    estado: 'ACTIVO',
    observaciones: '',
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
  } = useResource(contratosService, { search: '' })

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
      setFormData({
        inmueble: typeof item.inmueble === 'object' ? item.inmueble.id : item.inmueble,
        cliente: typeof item.cliente === 'object' ? item.cliente.id : item.cliente,
        tipo_contrato: item.tipo_contrato || 'VENTA',
        fecha_inicio: item.fecha_inicio || '',
        fecha_fin: item.fecha_fin || '',
        valor_total: item.valor_total || '',
        estado: item.estado || 'ACTIVO',
        observaciones: item.observaciones || '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        inmueble: '',
        cliente: '',
        tipo_contrato: 'VENTA',
        fecha_inicio: '',
        fecha_fin: '',
        valor_total: '',
        estado: 'ACTIVO',
        observaciones: '',
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
      valor_total: parseFloat(formData.valor_total),
      fecha_fin: formData.fecha_fin || null,
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
    if (window.confirm('¿Estás seguro de eliminar este contrato?')) {
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
    { key: 'tipo_contrato', label: 'Tipo' },
    {
      key: 'fecha_inicio',
      label: 'Fecha Inicio',
      render: (value) => (value ? format(new Date(value), 'dd/MM/yyyy') : '-'),
    },
    {
      key: 'valor_total',
      label: 'Valor',
      render: (value) =>
        value
          ? new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          : '-',
    },
    { key: 'estado', label: 'Estado' },
  ]

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Contratos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Contrato
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar contratos..."
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
          {editingItem ? 'Editar Contrato' : 'Nuevo Contrato'}
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
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Contrato</InputLabel>
                  <Select
                    value={formData.tipo_contrato}
                    onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value })}
                    label="Tipo de Contrato"
                  >
                    <MenuItem value="VENTA">Venta</MenuItem>
                    <MenuItem value="ARRENDAMIENTO">Arrendamiento</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Inicio"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha Fin"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Valor Total"
                  value={formData.valor_total}
                  onChange={(e) => setFormData({ ...formData, valor_total: e.target.value })}
                  required
                  inputProps={{ step: '0.01' }}
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
                    <MenuItem value="ACTIVO">Activo</MenuItem>
                    <MenuItem value="FINALIZADO">Finalizado</MenuItem>
                    <MenuItem value="CANCELADO">Cancelado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
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

export default Contratos
