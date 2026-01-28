import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material'
import { ErrorAlert, ErrorMessage } from './ErrorAlert'

export function FormDialog({ open, onClose, onSubmit, title, fields = [], loading = false, error = null }) {
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleSubmit = async () => {
    const newErrors = {}
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} es requerido`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
      return
    }

    await onSubmit(formData)
    setFormData({})
    setFormErrors({})
  }

  const handleClose = () => {
    setFormData({})
    setFormErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <ErrorAlert error={error} />
        <Stack spacing={2}>
          {fields.map(field => (
            <Box key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={formData[field.name] || ''}
                onChange={handleChange}
                disabled={loading}
                error={!!formErrors[field.name]}
                helperText={formErrors[field.name]}
                required={field.required}
                multiline={field.multiline}
                rows={field.rows}
              />
              {formErrors[field.name] && (
                <ErrorMessage error={formErrors[field.name]} />
              )}
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="secondary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
