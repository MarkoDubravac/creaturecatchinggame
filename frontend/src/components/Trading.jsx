import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Stack,
  Badge,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  getAllUsers,
  getUserPokemon,
  getCaughtPokemons,
  offerTrade,
  getPendingTrades,
  getAllTrades,
  acceptTrade,
  rejectTrade,
  cancelTrade,
  getCurrentUser,
} from '../api/pokemonApi';
import { getTypeColor, getContrastColor } from '../utils/typeColors';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function Trading() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userPokemon, setUserPokemon] = useState([]);
  const [myPokemon, setMyPokemon] = useState([]);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [selectedMyPokemon, setSelectedMyPokemon] = useState('');
  const [selectedTheirPokemon, setSelectedTheirPokemon] = useState('');
  const [pendingTrades, setPendingTrades] = useState([]);
  const [allTrades, setAllTrades] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchMyPokemon();
    fetchTrades();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserPokemon(selectedUser);
    }
  }, [selectedUser]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.filter(u => u.username !== getCurrentUser()));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMyPokemon = async () => {
    try {
      const data = await getCaughtPokemons();
      setMyPokemon(data);
    } catch (error) {
      console.error('Error fetching my Pokemon:', error);
    }
  };

  const fetchUserPokemon = async (username) => {
    try {
      const data = await getUserPokemon(username);
      setUserPokemon(data);
    } catch (error) {
      console.error('Error fetching user Pokemon:', error);
    }
  };

  const fetchTrades = async () => {
    try {
      const pending = await getPendingTrades();
      const all = await getAllTrades();
      setPendingTrades(pending);
      setAllTrades(all);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const handleOfferTrade = async () => {
    if (!selectedMyPokemon || !selectedTheirPokemon || !selectedUser) {
      setAlert({ severity: 'error', message: 'Please select Pokemon to trade' });
      return;
    }

    try {
      const response = await offerTrade(
        selectedMyPokemon,
        selectedTheirPokemon,
        selectedUser
      );

      if (response.success) {
        setAlert({ severity: 'success', message: response.message });
        setTradeDialogOpen(false);
        setSelectedMyPokemon('');
        setSelectedTheirPokemon('');
        fetchTrades();
      } else {
        setAlert({ severity: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ severity: 'error', message: 'Failed to offer trade' });
    }
  };

  const handleAcceptTrade = async (tradeId) => {
    try {
      const response = await acceptTrade(tradeId);
      if (response.success) {
        setAlert({ severity: 'success', message: response.message });
        fetchTrades();
        fetchMyPokemon();
      } else {
        setAlert({ severity: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ severity: 'error', message: 'Failed to accept trade' });
    }
  };

  const handleRejectTrade = async (tradeId) => {
    try {
      const response = await rejectTrade(tradeId);
      if (response.success) {
        setAlert({ severity: 'info', message: response.message });
        fetchTrades();
      } else {
        setAlert({ severity: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ severity: 'error', message: 'Failed to reject trade' });
    }
  };

  const handleCancelTrade = async (tradeId) => {
    try {
      const response = await cancelTrade(tradeId);
      if (response.success) {
        setAlert({ severity: 'info', message: response.message });
        fetchTrades();
      } else {
        setAlert({ severity: 'error', message: response.message });
      }
    } catch (error) {
      setAlert({ severity: 'error', message: 'Failed to cancel trade' });
    }
  };

  const renderPokemonCard = (pokemon) => (
    <Card key={pokemon.id} elevation={2}>
      <CardMedia
        component="img"
        image={pokemon.imageUrl}
        alt={pokemon.name}
        sx={{ height: 120, objectFit: 'contain', pt: 1 }}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          #{pokemon.pokemonId.toString().padStart(3, '0')}
        </Typography>
        <Typography variant="subtitle2">{pokemon.name}</Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {pokemon.types.map((type) => {
            const bgColor = getTypeColor(type);
            const textColor = getContrastColor(bgColor);
            return (
              <Chip
                key={type}
                label={type}
                size="small"
                sx={{
                  backgroundColor: bgColor,
                  color: textColor,
                  fontWeight: 'bold',
                  fontSize: '0.6rem',
                  height: 18,
                }}
              />
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );

  const renderTradeCard = (trade) => {
    const currentUsername = getCurrentUser();
    const isReceiver = trade.receiverUsername === currentUsername;
    const isInitiator = trade.initiatorUsername === currentUsername;
    const isPending = trade.status === 'PENDING';

    return (
      <Card key={trade.id} elevation={3} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              {isInitiator ? `Offered to ${trade.receiverDisplayName}` : `From ${trade.initiatorDisplayName}`}
            </Typography>
            <Chip
              label={trade.status}
              color={
                trade.status === 'ACCEPTED'
                  ? 'success'
                  : trade.status === 'PENDING'
                  ? 'warning'
                  : 'default'
              }
              size="small"
            />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {isInitiator ? 'You offer:' : 'They offer:'}
              </Typography>
              {renderPokemonCard(trade.offeredPokemon)}
            </Grid>
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <SwapHorizIcon fontSize="large" color="action" />
            </Grid>
            <Grid item xs={5}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {isInitiator ? 'You receive:' : 'They want:'}
              </Typography>
              {renderPokemonCard(trade.requestedPokemon)}
            </Grid>
          </Grid>

          {isPending && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {isReceiver && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                    onClick={() => handleAcceptTrade(trade.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => handleRejectTrade(trade.id)}
                  >
                    Reject
                  </Button>
                </>
              )}
              {isInitiator && (
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<CancelIcon />}
                  onClick={() => handleCancelTrade(trade.id)}
                >
                  Cancel
                </Button>
              )}
            </Box>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {new Date(trade.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab
            label={
              <Badge badgeContent={pendingTrades.length} color="error">
                Pending Trades
              </Badge>
            }
          />
          <Tab label="Make a Trade" />
          <Tab label="Trade History" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom>
          Pending Trade Offers
        </Typography>
        {pendingTrades.length === 0 ? (
          <Alert severity="info">No pending trades</Alert>
        ) : (
          pendingTrades.map((trade) => renderTradeCard(trade))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>
          Offer a Trade
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser}
            label="Select User"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {users.map((user) => (
              <MenuItem key={user.username} value={user.username}>
                {user.displayName} ({user.pokemonCount} Pokemon)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUser && (
          <>
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              onClick={() => setTradeDialogOpen(true)}
              disabled={myPokemon.length === 0 || userPokemon.length === 0}
              fullWidth
            >
              Propose Trade
            </Button>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              {users.find((u) => u.username === selectedUser)?.displayName}'s Pokemon
            </Typography>
            <Grid container spacing={2}>
              {userPokemon.map((pokemon) => (
                <Grid item xs={6} sm={4} md={3} key={pokemon.id}>
                  {renderPokemonCard(pokemon)}
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>
          Trade History
        </Typography>
        {allTrades.length === 0 ? (
          <Alert severity="info">No trades yet</Alert>
        ) : (
          allTrades.map((trade) => renderTradeCard(trade))
        )}
      </TabPanel>

      <Dialog open={tradeDialogOpen} onClose={() => setTradeDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Propose a Trade</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Your Pokemon</InputLabel>
                <Select
                  value={selectedMyPokemon}
                  label="Your Pokemon"
                  onChange={(e) => setSelectedMyPokemon(e.target.value)}
                >
                  {myPokemon.map((pokemon) => (
                    <MenuItem key={pokemon.id} value={pokemon.id}>
                      #{pokemon.pokemonId} {pokemon.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Their Pokemon</InputLabel>
                <Select
                  value={selectedTheirPokemon}
                  label="Their Pokemon"
                  onChange={(e) => setSelectedTheirPokemon(e.target.value)}
                >
                  {userPokemon.map((pokemon) => (
                    <MenuItem key={pokemon.id} value={pokemon.id}>
                      #{pokemon.pokemonId} {pokemon.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTradeDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleOfferTrade} variant="contained" color="primary">
            Offer Trade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Trading;
