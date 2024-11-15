import React from "react";
import { Children } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica el payload del token
    return payload.exp > Date.now() / 1000; // Verificar si el token ha expirado
};
 const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
 };

 export default ProtectedRoute;