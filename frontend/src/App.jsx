import React, { useState, useEffect } from 'react';
import {
  Container,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import LogoutIcon from '@mui/icons-material/Logout';
import PokemonList from './components/PokemonList';
import CatchPokemon from './components/CatchPokemon';
import CaughtPokemons from './components/CaughtPokemons';
import Trading from './components/Trading';
import Login from './components/Login';
import Register from './components/Register';
import { isAuthenticated, logout, getUserDisplayName } from './api/pokemonApi';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EE1515',
    },
    secondary: {
      main: '#3B4CCA',
    },
  },
});

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  useEffect(() => {
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    if (authStatus) {
      setUserDisplayName(getUserDisplayName());
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLoginSuccess = (user) => {
    setAuthenticated(true);
    setUserDisplayName(user.displayName);
    setShowRegister(false);
  };

  const handleRegisterSuccess = (user) => {
    setAuthenticated(true);
    setUserDisplayName(user.displayName);
    setShowRegister(false);
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUserDisplayName('');
    setTabValue(0);
  };

  if (!authenticated) {
    if (showRegister) {
      return (
        <ThemeProvider theme={theme}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <CatchingPokemonIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Pokemon Catcher
                </Typography>
              </Toolbar>
            </AppBar>
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setShowRegister(false)}
            />
          </Box>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <CatchingPokemonIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Pokemon Catcher
              </Typography>
            </Toolbar>
          </AppBar>
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <CatchingPokemonIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Pokemon Catcher
            </Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {userDisplayName}!
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Catch Pokemon" />
              <Tab label="All Pokemon" />
              <Tab label="My Collection" />
              <Tab label="Trading" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <CatchPokemon />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PokemonList />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <CaughtPokemons />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Trading />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
