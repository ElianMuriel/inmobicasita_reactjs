import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
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
import { rolesService } from '../../services/resourceService'
import DataTable from '../../components/DataTable'

function Roles() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    nombre_rol: '',
    descripcion: '',
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
  } = useResource(rolesService, { search: '' })

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        nombre_rol: item.nombre_rol || '',
        descripcion: item.descripcion || '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        nombre_rol: '',
        descripcion: '',
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

    const result = editingItem
      ? await update(editingItem.id, formData)
      : await create(formData)

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
    if (window.confirm(`¿Estás seguro de eliminar el rol "${item.nombre_rol}"?`)) {
      const result = await remove(item.id)
      if (!result.success) {
        alert('Error al eliminar: ' + (result.error?.detail || 'Error desconocido'))
      }
    }
  }

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre_rol', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
  ]

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Roles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Nuevo Rol
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar roles..."
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
          {editingItem ? 'Editar Rol' : 'Nuevo Rol'}
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
                <TextField
                  fullWidth
                  label="Nombre del Rol"
                  value={formData.nombre_rol}
                  onChange={(e) => setFormData({ ...formData, nombre_rol: e.target.value })}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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

export default Roles
