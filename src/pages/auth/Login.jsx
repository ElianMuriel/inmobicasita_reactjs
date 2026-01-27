import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { useAuth } from '../../contexts/AuthContext'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.username, formData.password)
      if (result.success) {
        const userData = result.user || user
        console.log('User data after login:', userData)
        console.log('Rol:', userData?.rol, 'is_vendedor:', userData?.is_vendedor, 'is_staff:', userData?.is_staff)
        
        if (userData?.rol === 'ADMIN' || userData?.is_staff) {
          console.log('Redirigiendo a /admin')
          navigate('/admin')
        } else if (userData?.rol === 'VENDEDOR' || userData?.is_vendedor) {
          console.log('Redirigiendo a /vendedor')
          navigate('/vendedor')
        } else {
          console.log('Redirigiendo a / (cliente)')
          navigate('/')
        }
      } else {
        setError(result.error || 'Error al iniciar sesión')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intenta de nuevo.')
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
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

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
                <CircularProgress size={24} color="inherit" />
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
