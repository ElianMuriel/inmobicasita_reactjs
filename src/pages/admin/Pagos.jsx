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
import { pagosService, contratosService } from '../../services/resourceService'
import { format } from 'date-fns'
import DataTable from '../../components/DataTable'

function Pagos() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [contratos, setContratos] = useState([])
  const [formData, setFormData] = useState({
    contrato: '',
    fecha_pago: '',
    monto: '',
    metodo_pago: 'EFECTIVO',
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
  } = useResource(pagosService, { search: '' })

  useEffect(() => {
    loadRelatedData()
  }, [])

  const loadRelatedData = async () => {
    try {
      const contratosRes = await contratosService.getAll()
      setContratos(contratosRes.data.results || contratosRes.data)
    } catch (err) {
      console.error('Error loading related data:', err)
    }
  }

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        contrato: typeof item.contrato === 'object' ? item.contrato.id : item.contrato,
        fecha_pago: item.fecha_pago || '',
        monto: item.monto || '',
        metodo_pago: item.metodo_pago || 'EFECTIVO',
        observaciones: item.observaciones || '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        contrato: '',
        fecha_pago: '',
        monto: '',
        metodo_pago: 'EFECTIVO',
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
      contrato: parseInt(formData.contrato),
      monto: parseFloat(formData.monto),
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
    if (window.confirm('¿Estás seguro de eliminar este pago?')) {
      const result = await remove(item.id)
      if (!result.success) {
        alert('Error al eliminar: ' + (result.error?.detail || 'Error desconocido'))
      }
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'contrato',
      label: 'Contrato',
      render: (value) => (typeof value === 'object' ? `Contrato #${value?.id}` : value),
    },
    {
      key: 'fecha_pago',
      label: 'Fecha',
      render: (value) => (value ? format(new Date(value), 'dd/MM/yyyy') : '-'),
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (value) =>
        value
          ? new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          : '-',
    },
    { key: 'metodo_pago', label: 'Método' },
  ]

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Pagos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Pago
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar pagos..."
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
          {editingItem ? 'Editar Pago' : 'Nuevo Pago'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Contrato</InputLabel>
                  <Select
                    value={formData.contrato}
                    onChange={(e) => setFormData({ ...formData, contrato: e.target.value })}
                    label="Contrato"
                  >
                    {contratos.map((contrato) => (
                      <MenuItem key={contrato.id} value={contrato.id}>
                        Contrato #{contrato.id} - {typeof contrato.inmueble === 'object' ? contrato.inmueble.titulo : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Pago"
                  value={formData.fecha_pago}
                  onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monto"
                  value={formData.monto}
                  onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                  required
                  inputProps={{ step: '0.01' }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Método de Pago</InputLabel>
                  <Select
                    value={formData.metodo_pago}
                    onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                    label="Método de Pago"
                  >
                    <MenuItem value="EFECTIVO">Efectivo</MenuItem>
                    <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
                    <MenuItem value="TARJETA">Tarjeta</MenuItem>
                    <MenuItem value="OTRO">Otro</MenuItem>
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

export default Pagos
