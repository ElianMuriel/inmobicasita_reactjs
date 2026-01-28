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
      <Box
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' },
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '500px', md: '600px' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(26, 58, 58, 0.7)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
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
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
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
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
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
                opacity: 0.95,
                fontSize: { xs: '1rem', md: '1.25rem' },
                textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
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
                fontWeight: 600,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: 4
                }
              }}
            >
              MÁS DETALLES
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#f5f5f5', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            ¿Por qué elegirnos?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              fontWeight: 300
            }}
          >
            Ofrecemos las mejores soluciones inmobiliarias con un equipo profesional
          </Typography>
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  minHeight: '300px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
                    bgcolor: '#f0f8f8'
                  }
                }}
              >
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'space-around' }}>
                  <Box 
                    sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      justifyContent: 'center',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'secondary.light'
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=500&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 6, md: 8 },
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(26, 58, 58, 0.75)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mb: 2,
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            ¿Listo para encontrar tu propiedad ideal?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.95,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              fontWeight: 300
            }}
          >
            Explora nuestro catálogo y encuentra la propiedad de tus sueños
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
              fontWeight: 600,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 4
              }
            }}
          >
            Explorar Propiedades
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
