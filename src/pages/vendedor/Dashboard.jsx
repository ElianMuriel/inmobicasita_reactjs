import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Avatar
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import { inmueblesService, visitasService } from '../../services/resourceService'
import { useAuth } from '../../contexts/AuthContext'

function VendedorDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalInmuebles: 0,
    inmueblesDisponibles: 0,
    visitasProgramadas: 0,
    visitasRealizadas: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [inmueblesRes, visitasRes] = await Promise.all([
        inmueblesService.getAll({ usuario: user?.user_id }),
        visitasService.getAll(),
      ])

      const inmuebles = inmueblesRes.data.results || inmueblesRes.data
      const visitas = visitasRes.data.results || visitasRes.data

      setStats({
        totalInmuebles: inmuebles.length,
        inmueblesDisponibles: inmuebles.filter(i => i.estado === 'DISPONIBLE').length,
        visitasProgramadas: visitas.filter(v => v.estado === 'PROGRAMADA').length,
        visitasRealizadas: visitas.filter(v => v.estado === 'REALIZADA').length,
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Inmuebles',
      value: stats.totalInmuebles,
      icon: <HomeIcon />,
      color: '#1a3a3a',
      bgColor: '#e8f4f4'
    },
    {
      title: 'Disponibles',
      value: stats.inmueblesDisponibles,
      icon: <CheckCircleIcon />,
      color: '#2d4a4a',
      bgColor: '#e8f4f4'
    },
    {
      title: 'Citas Programadas',
      value: stats.visitasProgramadas,
      icon: <EventIcon />,
      color: '#d4a574',
      bgColor: '#faf5ef'
    },
    {
      title: 'Citas Realizadas',
      value: stats.visitasRealizadas,
      icon: <EventAvailableIcon />,
      color: '#2d4a4a',
      bgColor: '#e8f4f4'
    }
  ]

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Dashboard - Vendedor
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Bienvenido, {user?.username}
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
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
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 56,
                      height: 56,
                      mr: 2
                    }}
                  >
                    {stat.icon}
                  </Avatar>
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
        ))}
      </Grid>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
          Acciones Rápidas
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              component={Link}
              to="/vendedor/inmuebles"
              sx={{
                textDecoration: 'none',
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <HomeIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  Gestionar Inmuebles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crear y editar propiedades
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              component={Link}
              to="/vendedor/visitas"
              sx={{
                textDecoration: 'none',
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <EventIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
                  Gestionar Citas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Programar y ver visitas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default VendedorDashboard
