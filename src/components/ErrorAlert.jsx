import { Alert, Box, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export function ErrorAlert({ error, onClose, severity = 'error' }) {
  if (!error) return null

  const errorMessage = typeof error === 'string' 
    ? error 
    : error.detail || error.message || 'Ocurrió un error'

  return (
    <Alert 
      severity={severity}
      onClose={onClose}
      action={
        onClose && (
          <IconButton
            size="small"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )
      }
      sx={{ mb: 2 }}
    >
      {errorMessage}
    </Alert>
  )
}

export function ErrorMessage({ error }) {
  if (!error) return null

  const message = typeof error === 'string'
    ? error
    : error.detail || error.message || 'Ocurrió un error desconocido'

  return (
    <Box sx={{ 
      color: 'error.main', 
      fontSize: '0.875rem',
      mt: 0.5,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      {message}
    </Box>
  )
}
