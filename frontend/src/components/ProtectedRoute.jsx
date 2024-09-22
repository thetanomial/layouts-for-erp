import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth/AuthContext'; // Adjust the import path
import { getCurrentUser } from '../api/authApi';

const ProtectedRoute = ({ children }) => {
  const { loading: authLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // New loading state for user fetching

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Log the token

    const fetchUser = async () => {
      if (token) {
        try {
          const user = await getCurrentUser(token);
          console.log('Current User:', user); // Log the current user
          setCurrentUser(user); // Set the currentUser directly
        } catch (error) {
          console.error('Not authenticated:', error);
          setCurrentUser(null); // Set to null on error
        }
      } else {
        console.log('No token found');
        setCurrentUser(null); // No token, no user
      }
      setUserLoading(false); // Set user loading to false after fetching
    };

    fetchUser();
  }, []);

  // Log the currentUser state
  useEffect(() => {
    console.log('Current User:', currentUser);
  }, [currentUser]);

  // Show a loading state while checking authentication
  if (authLoading || userLoading) {
    return <div>Loading...</div>;
  }

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
