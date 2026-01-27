import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useAuth } from '../contexts/AuthContext'

function PublicLayout() {
  const { isAuthenticated, user, logout, isAdmin, isVendedor } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
    setAnchorEl(null)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <HomeIcon sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                flexGrow: { xs: 1, md: 0 },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
                mr: { md: 4 }
              }}
            >
              InmobiCasita
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4 }}>
              <Button component={Link} to="/" color="inherit" sx={{ fontWeight: 500 }}>
                Inicio
              </Button>
              <Button component={Link} to="/propiedades" color="inherit" sx={{ fontWeight: 500 }}>
                Propiedades
              </Button>
              <Button component={Link} to="/about" color="inherit" sx={{ fontWeight: 500 }}>
                Nosotros
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isAuthenticated ? (
                <>
                  {(isAdmin || isVendedor) && (
                    <Button
                      component={Link}
                      to={isAdmin ? "/admin" : "/vendedor"}
                      variant="outlined"
                      color="inherit"
                      startIcon={<AdminPanelSettingsIcon />}
                      sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                      {isAdmin ? "Panel Admin" : "Panel Vendedor"}
                    </Button>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      Hola, {user?.username}
                    </Typography>
                    <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                        <AccountCircleIcon />
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      {(isAdmin || isVendedor) && (
                        <MenuItem
                          component={Link}
                          to={isAdmin ? "/admin" : "/vendedor"}
                          onClick={handleMenuClose}
                        >
                          <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                          {isAdmin ? "Panel Admin" : "Panel Vendedor"}
                        </MenuItem>
                      )}
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} />
                        Salir
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="secondary"
                  sx={{ fontWeight: 600 }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Box
        component="footer"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 3,
          mt: 'auto'
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" align="center">
            &copy; 2024 InmobiCasita. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

export default PublicLayout
