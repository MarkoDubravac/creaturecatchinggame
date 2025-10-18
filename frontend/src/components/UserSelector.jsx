import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { getAllUsers, getCurrentUser, setCurrentUser } from '../api/pokemonApi';

function UserSelector() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserChange = (event) => {
    const newUser = event.target.value;
    setCurrentUser(newUser);
    setCurrentUserState(newUser);
    window.location.reload(); // Reload to refresh all data
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="user-select-label">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 0.5, fontSize: 20 }} />
            User
          </Box>
        </InputLabel>
        <Select
          labelId="user-select-label"
          value={currentUser}
          label="User"
          onChange={handleUserChange}
          sx={{ bgcolor: 'background.paper' }}
        >
          {users.map((user) => (
            <MenuItem key={user.username} value={user.username}>
              <Typography>
                {user.displayName} ({user.pokemonCount} Pokemon)
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default UserSelector;
