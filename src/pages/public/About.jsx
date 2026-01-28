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
    <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
      <Box
        sx={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          position: 'relative',
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Sobre InmobiCasita
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 300,
              fontSize: { xs: '1rem', md: '1.2rem' },
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            Líderes en soluciones inmobiliarias con más de 10 años de experiencia
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {sections.map((section, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 2,
                        pb: 1,
                        borderBottom: '3px solid',
                        borderColor: 'secondary.main'
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {section.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Valores y Contacto */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
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
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 3,
                      pb: 2,
                      borderBottom: '3px solid',
                      borderColor: 'secondary.main'
                    }}
                  >
                    Nuestros Valores
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {valores.map((valor, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                        <CheckCircleIcon sx={{ color: 'secondary.main', mr: 2, flexShrink: 0 }} />
                        <ListItemText
                          primary={
                            <Typography component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {valor.label}
                            </Typography>
                          }
                          secondary={valor.desc}
                          secondaryTypographyProps={{ color: 'text.secondary', sx: { fontSize: '0.875rem' } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
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
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 3,
                      pb: 2,
                      borderBottom: '3px solid',
                      borderColor: 'secondary.main'
                    }}
                  >
                    Contacto
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: '#f5f5f5',
                      border: '2px solid',
                      borderColor: 'secondary.light',
                      borderRadius: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                      <EmailIcon sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          Email
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          info@inmobicasita.com
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                      <PhoneIcon sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          Teléfono
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          (+593) 991182431
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          Dirección
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                          UTE, Quito
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default About
