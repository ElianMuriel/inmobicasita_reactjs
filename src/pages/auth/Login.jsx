import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Collapse,
  IconButton
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../../contexts/AuthContext'
import { ErrorAlert } from '../../components/ErrorAlert'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'El usuario es requerido'
    } else if (formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres'
    }
    
    if (!formData.password || formData.password === '') {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
    setApiError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const result = await login(formData.username, formData.password)
      if (result.success) {
        const userData = result.user || user
        
        if (userData?.rol === 'ADMIN' || userData?.is_staff) {
          navigate('/admin')
        } else if (userData?.rol === 'VENDEDOR' || userData?.is_vendedor) {
          navigate('/vendedor')
        } else {
          navigate('/')
        }
      } else {
        setApiError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.')
      }
    } catch (err) {
      setApiError('Error al conectar con el servidor. Por favor, intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a3a3a 0%, #2d4a4a 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HomeIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
              InmobiCasita
            </Typography>
            <Typography variant="h6" component="h2" sx={{ color: 'text.secondary', mb: 1 }}>
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accede al panel de administración
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <ErrorAlert 
              error={apiError} 
              onClose={() => setApiError('')}
            />

            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!errors.username}
              helperText={errors.username}
              placeholder="Ingresa tu usuario"
              autoFocus
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              margin="normal"
              variant="outlined"
              disabled={loading}
              error={!!errors.password}
              helperText={errors.password}
              placeholder="Ingresa tu contraseña"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Iniciando sesión...
                </Box>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
            ¿No tienes cuenta? Contacta al administrador del sistema.
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default Login
