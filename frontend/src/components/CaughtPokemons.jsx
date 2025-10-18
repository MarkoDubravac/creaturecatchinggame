import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { getCaughtPokemons } from '../api/pokemonApi';
import { getTypeColor, getContrastColor } from '../utils/typeColors';

function CaughtPokemons() {
  const [caughtPokemons, setCaughtPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaughtPokemons();
  }, []);

  const fetchCaughtPokemons = async () => {
    try {
      const data = await getCaughtPokemons();
      setCaughtPokemons(data);
    } catch (error) {
      console.error('Error fetching caught pokemons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (caughtPokemons.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          You haven't caught any Pokemon yet! Go to the "Catch Pokemon" tab to start your collection.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        My Pokemon Collection ({caughtPokemons.length})
      </Typography>
      <Grid container spacing={3}>
        {caughtPokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
            <Card
              elevation={3}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              <CardMedia
                component="img"
                image={pokemon.imageUrl}
                alt={pokemon.name}
                sx={{ height: 180, objectFit: 'contain', pt: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  #{pokemon.pokemonId.toString().padStart(3, '0')}
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                  {pokemon.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                  {pokemon.types && pokemon.types.map((type) => {
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
                <Typography variant="caption" color="text.secondary">
                  Caught: {new Date(pokemon.caughtAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CaughtPokemons;
