import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Skeleton,
  Alert
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import EventIcon from '@mui/icons-material/Event'
import DescriptionIcon from '@mui/icons-material/Description'
import {
  inmueblesService,
  clientesService,
  propietariosService,
  visitasService,
  contratosService,
} from '../../services/resourceService'

function Dashboard() {
  const [stats, setStats] = useState({
    inmuebles: 0,
    clientes: 0,
    propietarios: 0,
    visitas: 0,
    contratos: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setError(null)
      const [inmuebles, clientes, propietarios, visitas, contratos] =
        await Promise.all([
          inmueblesService.getAll(),
          clientesService.getAll(),
          propietariosService.getAll(),
          visitasService.getAll(),
          contratosService.getAll(),
        ])

      setStats({
        inmuebles: inmuebles.data.count || inmuebles.data.length || 0,
        clientes: clientes.data.count || clientes.data.length || 0,
        propietarios: propietarios.data.count || propietarios.data.length || 0,
        visitas: visitas.data.count || visitas.data.length || 0,
        contratos: contratos.data.count || contratos.data.length || 0,
      })
    } catch (error) {
      console.error('Error loading stats:', error)
      setError('No se pudieron cargar las estadísticas. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Inmuebles',
      value: stats.inmuebles,
      icon: <HomeIcon />,
      color: '#1a3a3a',
      bgColor: '#e8f4f4'
    },
    {
      title: 'Clientes',
      value: stats.clientes,
      icon: <PeopleIcon />,
      color: '#2d4a4a',
      bgColor: '#e8f4f4'
    },
    {
      title: 'Propietarios',
      value: stats.propietarios,
      icon: <BusinessIcon />,
      color: '#1a3a3a',
      bgColor: '#e8f4f4'
    },
    {
      title: 'Visitas',
      value: stats.visitas,
      icon: <EventIcon />,
      color: '#d4a574',
      bgColor: '#faf5ef'
    },
    {
      title: 'Contratos',
      value: stats.contratos,
      icon: <DescriptionIcon />,
      color: '#2d4a4a',
      bgColor: '#e8f4f4'
    }
  ]

  // Renderizar skeletons mientras carga
  const renderStatCards = () => {
    if (loading) {
      return [...Array(5)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="circular" width={56} height={56} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
              <Skeleton variant="text" height={40} width="60%" />
            </CardContent>
          </Card>
        </Grid>
      ))
    }

    return statCards.map((stat, index) => (
      <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
        <Card
          sx={{
            height: '100%',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: 6
            }
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  bgcolor: stat.bgColor,
                  color: stat.color,
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}
              >
                {stat.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Resumen general del sistema
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {renderStatCards()}
      </Grid>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
          Bienvenido al Panel de Administración
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
          Desde aquí puedes gestionar todas las entidades del sistema:
          inmuebles, clientes, propietarios, visitas, contratos, pagos y más.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Utiliza el menú de navegación para acceder a cada sección y realizar
          las operaciones CRUD correspondientes.
        </Typography>
      </Paper>
    </Container>
  )
}

export default Dashboard
