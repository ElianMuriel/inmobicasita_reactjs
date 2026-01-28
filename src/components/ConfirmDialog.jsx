import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading = false, variant = 'warning' }) {
  const colors = {
    warning: 'warning',
    error: 'error',
    info: 'info',
    success: 'success'
  }

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color={colors[variant]} />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={colors[variant]}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Confirmar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
