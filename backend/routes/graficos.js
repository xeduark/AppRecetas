const express = require('express');
const router = express.Router();
const db = require('../config/firebase');

// Ruta para obtener datos agregados por tipo de receta
router.get('/recetas-por-tipo', async (req, res) => {
    try {
        const recetasSnapshot = await db.collection('recetas').get();
        const recetas = recetasSnapshot.docs.map(doc => doc.data());

        // Contar el número de recetas por tipo
        let vegetarianas = 0;
        let novegetarianas = 0;
        recetas.forEach(receta => {
            if (receta.type === 'vegetariana') {
                vegetarianas++;
            } else if (receta.type === 'novegetariana') {
                novegetarianas++;
            }
        });

        // Calcular el total
        const total = vegetarianas + novegetarianas;

        // Estructura de datos para react-chartjs-2
        const data = {
            total: total, // Total de recetas
            vegetarianas: vegetarianas,
            novegetarianas: novegetarianas
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener datos de gráficos', error);
        res.status(500).json({ message: 'Error al obtener datos de gráficos' });
    }
});

module.exports = router;