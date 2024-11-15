import React from 'react';
import Vegetarianas from '../pages/Vegetarianas';
import NoVegetarianas from '../pages/NoVegetarianas';
import Dashboard from '../pages/Dashboard';
import CrearReceta from '../pages/CrearReceta';
import EditarReceta from '../pages/EditarReceta';
import Login from '../forms/Login'
import Home from '../pages/Home';
import ProtectedRoute from '../routes/ProtectedRoute';


export let enrutadorApp = [
    {
        element: <Login />,
        path: "login",
    },
    {
        path: "/",
        element: (
            <ProtectedRoute> {/* Proteje el acceso al Dashboard y a sus rutas hijas */}
                <Dashboard />
            </ProtectedRoute>
    ),
        children: [
            {
                path: 'vegetarianas',
                element: <Vegetarianas />
            },
            {
                path: 'novegetarianas',
                element: <NoVegetarianas />
            },
            {
                path: 'crear-receta',
                element: <CrearReceta/>
            },
            {
                path: '/recetas/:recetaId/editar',
                element: <EditarReceta/>
            },
            {
                path: '/estadisticas',
                element: <Home/>
            }
        ]
    },
]