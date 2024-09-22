import React, { createContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Ensure you have the correct import
import authReducer from './authReducer';
import { getCurrentUser, loginUser, registerUser } from '../../api/authApi';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  current_user_details : {}
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const currentUser = await getCurrentUser(token); // Make sure getCurrentUser is imported
        dispatch({ type: 'SET_CURRENT_USER_DETAILS', payload: currentUser });
      } catch (error) {
        console.error('Error fetching current user details:', error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        dispatch({ type: 'SET_USER', payload: decodedToken });
        fetchCurrentUser()
      } catch (error) {
        console.error('Token is invalid:', error);
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
        const user = await loginUser(email, password);
        localStorage.setItem('token', user.token); // Store token directly
        const decodedToken = jwtDecode(user.token);
        dispatch({ type: 'SET_USER', payload: decodedToken });

        // Fetch and set current user details here
        const currentUserDetails = await getCurrentUser(user.token);
        dispatch({ type: 'SET_CURRENT_USER_DETAILS', payload: currentUserDetails });

        navigate('/dashboard');
    } catch (error) {
        console.log('Login error:', error);
    } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
    }
};


  const register = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await registerUser(email, password);
      localStorage.setItem('token', user.token); // Store token directly
      const decodedToken = jwtDecode(user.token);
      dispatch({ type: 'SET_USER', payload: decodedToken });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_CURRENT_USER_DETAILS', payload: {} }); // Reset current user details
    navigate('/login');
};


  
  

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
