import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('authToken');

    if (!isAuthenticated) {
        return <Navigate to="/login/" replace />;
    }
    else{
        <Navigate to='/' />
    }

    return children;
};

export default ProtectedRoute;
