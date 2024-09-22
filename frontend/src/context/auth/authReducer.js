// authReducer.js
const authReducer = (state, action) => {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_CURRENT_USER_DETAILS':
        return { ...state, current_user_details: action.payload };
      default:
        return state;
    }
  };
  
  export default authReducer;
  