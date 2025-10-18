import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { catchPokemon, getCatchStatus } from '../api/pokemonApi';
import { getTypeColor, getContrastColor } from '../utils/typeColors';

function CatchPokemon() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [catchStatus, setCatchStatus] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    fetchCatchStatus();
    const interval = setInterval(fetchCatchStatus, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (catchStatus && !catchStatus.canCatch) {
      const interval = setInterval(() => {
        const now = new Date();
        const nextCatch = new Date(catchStatus.nextCatchAvailable);
        const diff = nextCatch - now;

        if (diff <= 0) {
          fetchCatchStatus();
          setRemainingTime(null);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setRemainingTime(`${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [catchStatus]);

  const fetchCatchStatus = async () => {
    try {
      const status = await getCatchStatus();
      setCatchStatus(status);
    } catch (error) {
      console.error('Error fetching catch status:', error);
    }
  };

  const handleCatchPokemon = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await catchPokemon();
      setResult(response);
      fetchCatchStatus();
    } catch (error) {
      setResult({
        success: false,
        message: 'Error catching Pokemon. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Catch a Random Pokemon!
          </Typography>

          {catchStatus && !catchStatus.canCatch && (
            <Alert severity="info" sx={{ mb: 2 }} icon={<AccessTimeIcon />}>
              <Typography variant="body2">
                Next catch available in: <strong>{remainingTime}</strong>
              </Typography>
            </Alert>
          )}

          <Box sx={{ textAlign: 'center', my: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleCatchPokemon}
              disabled={loading || (catchStatus && !catchStatus.canCatch)}
              startIcon={loading ? <CircularProgress size={20} /> : <CatchingPokemonIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              {loading ? 'Catching...' : 'Catch Pokemon'}
            </Button>
          </Box>

          {result && (
            <Box sx={{ mt: 3 }}>
              {result.success ? (
                <Card elevation={2} sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {result.message}
                    </Typography>
                    {result.pokemon && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <CardMedia
                          component="img"
                          image={result.pokemon.imageUrl}
                          alt={result.pokemon.name}
                          sx={{ width: 200, height: 200, mx: 'auto' }}
                        />
                        <Typography variant="h5" sx={{ mt: 2 }}>
                          {result.pokemon.name}
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                          {result.pokemon.types.map((type) => {
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
                                }}
                              />
                            );
                          })}
                        </Stack>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Height: {result.pokemon.height} | Weight: {result.pokemon.weight}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="warning">{result.message}</Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default CatchPokemon;
