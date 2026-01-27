import { Link } from 'react-router-dom'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Paper
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import './Home.css'

function Home() {
  const features = [
    {
      icon: <HomeIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Amplia Variedad',
      description: 'Contamos con una amplia gama de propiedades: casas, apartamentos, locales comerciales y más.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Seguridad',
      description: 'Todas nuestras transacciones son seguras y transparentes, con documentación legal completa.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Asesoría Profesional',
      description: 'Nuestro equipo de expertos te acompañará en cada paso del proceso.'
    },
    {
      icon: <AttachMoneyIcon sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Mejores Precios',
      description: 'Ofrecemos las mejores opciones del mercado con precios competitivos.'
    }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #1a3a3a 0%, #2d4a4a 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="overline"
              sx={{
                fontSize: '0.875rem',
                letterSpacing: 2,
                color: 'secondary.main',
                fontWeight: 600,
                mb: 2,
                display: 'block'
              }}
            >
              INMOBILIARIA
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 1,
                lineHeight: 1.2
              }}
            >
              TU CASA
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 3,
                color: 'secondary.main',
                lineHeight: 1.2
              }}
            >
              DE ENSUEÑO
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                opacity: 0.9,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Adquiera en el mejor lugar, terrenos, casas, departamentos, locales comerciales, casas de playas.
            </Typography>
            <Button
              component={Link}
              to="/propiedades"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              MÁS DETALLES
            </Button>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          ¿Por qué elegirnos?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper
        sx={{
          background: 'linear-gradient(135deg, #d4a574 0%, #c8965f 100%)',
          color: 'white',
          py: { xs: 6, md: 8 }
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 600
            }}
          >
            ¿Listo para encontrar tu propiedad ideal?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.95
            }}
          >
            Explora nuestro catálogo y encuentra la propiedad de tus sueños
          </Typography>
          <Button
            component={Link}
            to="/propiedades"
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Explorar Propiedades
          </Button>
        </Container>
      </Paper>
    </Box>
  )
}

export default Home
