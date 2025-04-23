// API URL for the Puppy Bowl data
const API_URL = 'https://fsa-puppy-bowl.herokuapp.com/api/2306-FSA-ET-WEB-FT-SF';

/**
 * Fetches all players from the API
 * @returns {Promise<Array>} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result.data.players;
  } catch (error) {
    console.error('Error fetching all players:', error);
    return [];
  }
};

/**
 * Fetches a single player from the API
 * @param {number} playerId - The ID of the player to fetch
 * @returns {Promise<Object>} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result.data.player;
  } catch (error) {
    console.error(`Error fetching player #${playerId}:`, error);
    return null;
  }
};

/**
 * Adds a new player to the roster via the API
 * @param {Object} playerObj - the player to add
 * @returns {Promise<Object>} the player object with its new ID
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    return result.data.newPlayer;
  } catch (error) {
    console.error('Error adding new player:', error);
    return null;
  }
};

/**
 * Removes a player from the roster via the API
 * @param {number} playerId - The ID of the player to remove
 * @returns {Promise<void>}
 */
const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    console.log(`Player #${playerId} was successfully removed`);
  } catch (error) {
    console.error(`Error removing player #${playerId}:`, error);
  }
};

/**
 * Updates the app state to reflect the current roster
 * @param {Array} playerList - the array of player objects
 * @returns {void}
 */
const renderAllPlayers = (playerList) => {
  if (!playerList || !playerList.length) {
    console.warn('No players to render');
    return;
  }

  const playerContainer = document.getElementById('all-players-container');
  playerContainer.innerHTML = '';

  playerList.forEach((player) => {
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card');
    
    playerCard.innerHTML = `
      <h3>${player.name}</h3>
      <img src="${player.imageUrl || 'https://placedog.net/300/300'}" alt="${player.name}">
      <p>Breed: ${player.breed}</p>
      <p>Team: ${player.teamId ? `#${player.teamId}` : 'Free Agent'}</p>
      <div class="button-container">
        <button class="details-button" data-id="${player.id}">See Details</button>
        <button class="remove-button" data-id="${player.id}">Remove</button>
      </div>
    `;
    
    playerContainer.appendChild(playerCard);
  });

  // Add event listeners to the newly created buttons
  document.querySelectorAll('.details-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const playerId = event.target.dataset.id;
      const player = await fetchSinglePlayer(playerId);
      renderSinglePlayer(player);
    });
  });

  document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const playerId = event.target.dataset.id;
      await removePlayer(playerId);
      const updatedPlayerList = await fetchAllPlayers();
      renderAllPlayers(updatedPlayerList);
    });
  });
};

/**
 * Updates the app state to display a single player's details
 * @param {Object} player - the player object to render
 * @returns {void}
 */
const renderSinglePlayer = (player) => {
  if (!player) {
    console.warn('No player to render');
    return;
  }

  const mainElement = document.querySelector('main');
  
  // Save the current state of the main element to restore later
  const currentContent = mainElement.innerHTML;

  // Create a modal or player details section
  const playerDetails = document.createElement('div');
  playerDetails.classList.add('player-details');
  
  playerDetails.innerHTML = `
    <div class="player-detail-card">
      <button id="back-button">← Back to all players</button>
      <h2>${player.name}</h2>
      <img src="${player.imageUrl || 'https://placedog.net/400/400'}" alt="${player.name}" class="detail-image">
      <div class="player-info">
        <p><strong>ID:</strong> #${player.id}</p>
        <p><strong>Breed:</strong> ${player.breed}</p>
        <p><strong>Status:</strong> ${player.status}</p>
        <p><strong>Team ID:</strong> ${player.teamId || 'Free Agent'}</p>
        <p><strong>Cohort ID:</strong> ${player.cohortId}</p>
        <p><strong>Created:</strong> ${new Date(player.createdAt).toLocaleDateString()}</p>
        <p><strong>Updated:</strong> ${new Date(player.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  `;
  
  mainElement.innerHTML = '';
  mainElement.appendChild(playerDetails);

  // Add event listener to the back button
  document.getElementById('back-button').addEventListener('click', () => {
    mainElement.innerHTML = currentContent;
    // Make sure the buttons still work after going back
    attachEventListeners();
  });
};

/**
 * Renders the form for adding a new player
 * @returns {void}
 */
const renderNewPlayerForm = () => {
  const formContainer = document.getElementById('new-player-form');
  
  // Make sure the form is visible
  formContainer.style.display = 'block';
  
  formContainer.innerHTML = `
    <h2>Add New Player</h2>
    <form id="add-player-form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
      </div>
      
      <div class="form-group">
        <label for="breed">Breed:</label>
        <input type="text" id="breed" name="breed" required>
      </div>
      
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" name="status" required>
          <option value="field">Field</option>
          <option value="bench">Bench</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="imageUrl">Image URL:</label>
        <input type="url" id="imageUrl" name="imageUrl" placeholder="https://placedog.net/300/300">
      </div>
      
      <div class="form-group">
        <label for="teamId">Team ID:</label>
        <input type="number" id="teamId" name="teamId" min="1">
      </div>
      
      <button type="submit">Add Player</button>
    </form>
  `;
  
  // Add event listener to the form
  document.getElementById('add-player-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const form = event.target;
    const playerData = {
      name: form.name.value,
      breed: form.breed.value,
      status: form.status.value,
      imageUrl: form.imageUrl.value || 'https://placedog.net/300/300',
      teamId: form.teamId.value ? Number(form.teamId.value) : null
    };
    
    const newPlayer = await addNewPlayer(playerData);
    
    if (newPlayer) {
      form.reset();
      const updatedPlayerList = await fetchAllPlayers();
      renderAllPlayers(updatedPlayerList);
      
      // Display a success message
      const successMessage = document.createElement('div');
      successMessage.classList.add('success-message');
      successMessage.textContent = `Player ${newPlayer.name} has been added!`;
      formContainer.appendChild(successMessage);
      
      // Remove the message after 3 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  });
};

/**
 * Attaches event listeners to the relevant elements in the DOM
 * @returns {void}
 */
const attachEventListeners = () => {
  // Toggle the new player form display
  const toggleFormButton = document.getElementById('new-player-button');
  if (toggleFormButton) {
    toggleFormButton.addEventListener('click', () => {
      const formContainer = document.getElementById('new-player-form');
      if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        renderNewPlayerForm();
      } else {
        formContainer.style.display = 'none';
      }
    });
  }

  // Re-attach event listeners to details and remove buttons
  document.querySelectorAll('.details-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const playerId = event.target.dataset.id;
      const player = await fetchSinglePlayer(playerId);
      renderSinglePlayer(player);
    });
  });

  document.querySelectorAll('.remove-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const playerId = event.target.dataset.id;
      await removePlayer(playerId);
      const updatedPlayerList = await fetchAllPlayers();
      renderAllPlayers(updatedPlayerList);
    });
  });
};

/**
 * Initializes the application
 * @returns {void}
 */
const init = async () => {
  // Fetch and render all players
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  
  // Set up the new player form
  renderNewPlayerForm();
  
  // Attach event listeners
  attachEventListeners();
};

// Initialize the app when the DOM content is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for testing
if (typeof module !== 'undefined') {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer
  };
}
