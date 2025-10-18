import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { getAllPokemons } from '../api/pokemonApi';
import { getTypeColor, getContrastColor } from '../utils/typeColors';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const data = await getAllPokemons(151, 0);
      setPokemons(data);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
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

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
        All Pokemon (First Generation)
      </Typography>
      <Grid container spacing={3}>
        {pokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
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
                  #{pokemon.id.toString().padStart(3, '0')}
                </Typography>
                <Typography variant="h6" component="h3" gutterBottom>
                  {pokemon.name}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
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
                        }}
                      />
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PokemonList;
