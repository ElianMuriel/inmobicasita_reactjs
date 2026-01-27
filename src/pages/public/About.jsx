import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import './About.css'

function About() {
  const sections = [
    {
      title: 'Nuestra Historia',
      content: 'Fundada con la visión de facilitar el acceso a propiedades de calidad, InmobiCasita ha crecido hasta convertirse en una de las inmobiliarias más confiables del mercado. Nuestro compromiso es brindar un servicio excepcional a cada uno de nuestros clientes.'
    },
    {
      title: 'Nuestra Misión',
      content: 'Proporcionar soluciones inmobiliarias integrales que satisfagan las necesidades de nuestros clientes, ofreciendo propiedades de calidad, asesoría profesional y procesos transparentes.'
    },
    {
      title: 'Nuestra Visión',
      content: 'Ser la inmobiliaria de referencia en la región, reconocida por nuestra excelencia en el servicio, innovación tecnológica y compromiso con la satisfacción del cliente.'
    }
  ]

  const valores = [
    { label: 'Transparencia', desc: 'Procesos claros y honestos' },
    { label: 'Confianza', desc: 'Construimos relaciones duraderas' },
    { label: 'Excelencia', desc: 'Buscamos la perfección en cada detalle' },
    { label: 'Compromiso', desc: 'Con nuestros clientes y su éxito' },
    { label: 'Innovación', desc: 'Tecnología al servicio de nuestros clientes' }
  ]

  return (
    <Box sx={{ minHeight: 'calc(100vh - 200px)', py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' }
            }}
          >
            Sobre Nosotros
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 300,
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            InmobiCasita es una empresa líder en el sector inmobiliario
          </Typography>
        </Box>

        {/* Content Grid */}
        <Grid container spacing={3}>
          {sections.map((section, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      mb: 2,
                      pb: 1,
                      borderBottom: '2px solid',
                      borderColor: 'secondary.main'
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.9 }}>
                    {section.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Valores */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2,
                    pb: 1,
                    borderBottom: '2px solid',
                    borderColor: 'secondary.main'
                  }}
                >
                  Valores
                </Typography>
                <List>
                  {valores.map((valor, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <CheckCircleIcon sx={{ color: 'secondary.main', mr: 2 }} />
                      <ListItemText
                        primary={
                          <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {valor.label}:
                          </Typography>
                        }
                        secondary={valor.desc}
                        secondaryTypographyProps={{ color: 'text.secondary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Contacto */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    color: 'primary.main',
                    mb: 2,
                    pb: 1,
                    borderBottom: '2px solid',
                    borderColor: 'secondary.main'
                  }}
                >
                  Contacto
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    bgcolor: 'background.default',
                    border: '2px solid',
                    borderColor: 'secondary.main',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ color: 'secondary.main', mr: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong style={{ color: '#1a3a3a' }}>Email:</strong> info@inmobicasita.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: 'secondary.main', mr: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong style={{ color: '#1a3a3a' }}>Teléfono:</strong> (+593) 991182431
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ color: 'secondary.main', mr: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      <strong style={{ color: '#1a3a3a' }}>Dirección:</strong> UTE, Quito
                    </Typography>
                  </Box>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default About
