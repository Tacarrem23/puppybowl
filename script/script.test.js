// Tests for fetchSinglePlayer
describe('fetchSinglePlayer', () => {
    // Test that it returns a player object with the correct ID
    test('should fetch a single player with the specified ID', async () => {
      // Mock data
      const mockPlayer = {
        id: 123,
        name: 'Buddy',
        breed: 'Golden Retriever',
        status: 'field',
        imageUrl: 'http://example.com/buddy.jpg',
        teamId: 456,
        cohortId: 789
      };
      
      // Mock the fetch function
      global.fetch = jest.fn(() => 
        Promise.resolve({
          json: () => Promise.resolve({ data: { player: mockPlayer } })
        })
      );
      
      // Call the function
      const player = await fetchSinglePlayer(123);
      
      // Check that fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith(`https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/players/123`);
      
      // Verify the returned player matches the mock
      expect(player).toEqual(mockPlayer);
    });
    
    // Test error handling
    test('should handle errors properly', async () => {
      // Mock fetch to throw an error
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      // Use a try/catch to check if the function throws
      try {
        await fetchSinglePlayer(123);
        // If we get here, no error was thrown, so the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Network error');
      }
    });
  });
  
  // Tests for addNewPlayer
  describe('addNewPlayer', () => {
    // Test that it correctly sends a POST request
    test('should add a new player with the provided data', async () => {
      // Mock player to add
      const newPlayer = {
        name: 'Max',
        breed: 'Labrador',
        status: 'bench',
        imageUrl: 'http://example.com/max.jpg',
        teamId: 456,
        cohortId: 789
      };
      
      // Mock response from server
      const mockResponse = {
        data: { 
          newPlayer: {
            id: 999,
            ...newPlayer
          }
        }
      };
      
      // Mock the fetch function
      global.fetch = jest.fn(() => 
        Promise.resolve({
          json: () => Promise.resolve(mockResponse)
        })
      );
      
      // Call the function
      const result = await addNewPlayer(newPlayer);
      
      // Check that fetch was called with the correct URL and method
      expect(fetch).toHaveBeenCalledWith(
        'https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/players',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPlayer),
        }
      );
      
      // Verify the returned player has the correct data
      expect(result).toEqual(mockResponse.data.newPlayer);
    });
    
    // Test error handling
    test('should handle errors when adding a player fails', async () => {
      const newPlayer = { name: 'Max', breed: 'Labrador' };
      
      // Mock fetch to throw an error
      global.fetch = jest.fn(() => Promise.reject(new Error('Failed to add player')));
      
      // Use a try/catch to check if the function throws
      try {
        await addNewPlayer(newPlayer);
        // If we get here, no error was thrown, so the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Failed to add player');
      }
    });
  });
  
  // Optional: Tests for removePlayer
  describe('removePlayer', () => {
    // Test that it correctly sends a DELETE request
    test('should remove a player with the specified ID', async () => {
      // Mock success response
      const mockResponse = {
        data: { 
          message: 'Player successfully removed!'
        }
      };
      
      // Mock the fetch function
      global.fetch = jest.fn(() => 
        Promise.resolve({
          json: () => Promise.resolve(mockResponse)
        })
      );
      
      // Call the function (since it returns nothing, we're just ensuring it completes)
      await removePlayer(123);
      
      // Check that fetch was called with the correct URL and method
      expect(fetch).toHaveBeenCalledWith(
        'https://fsa-puppy-bowl.herokuapp.com/api/2310-FSA-ET-WEB-FT-SF/players/123',
        {
          method: 'DELETE',
        }
      );
    });
    
    // Test error handling
    test('should handle errors when removing a player fails', async () => {
      // Mock fetch to throw an error
      global.fetch = jest.fn(() => Promise.reject(new Error('Failed to remove player')));
      
      // Use a try/catch to check if the function throws
      try {
        await removePlayer(123);
        // If we get here, no error was thrown, so the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('Failed to remove player');
      }
    });
  });
