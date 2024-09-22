import axiosInstance from './axiosInstance'; // Adjust the import path as needed

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/login', {
    email,
    password,
  });

  return response.data; // Return user data
};

export const registerUser = async (email, password) => {
  const response = await axiosInstance.post('/register', {
    email,
    password,
  });

  return response.data; // Return user data
};

export const logoutUser = () => {
  // Handle logout if needed, e.g., invalidate token on the backend
};

export const getCurrentUser = async (token) => {
    try {
      const response = await axiosInstance.get('/currentUser', {
        headers: {
          Authorization: `Bearer ${token}`, // Send the token in the headers
        },
      });
      return response.data; // Return user data
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error; // Rethrow the error for further handling
    }
  };
