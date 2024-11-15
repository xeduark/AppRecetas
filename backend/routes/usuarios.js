const express = require('express');
const router = express.Router();
const db = require('../config/firebase'); // Asegúrate de que este archivo esté configurado correctamente
const jwt = require('jsonwebtoken'); 

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'No autorizado' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });

      // Agregar la información del usuario a la solicitud
      req.user = user; 
      next(); 
  });
};

// Ruta protegida para obtener los datos del usuario
router.get('/user', authenticateToken, async (req, res) => {
  try {
      // Obtén el ID del usuario desde el token decodificado
      const userId = req.user.uid; 

      // Busca el usuario en Firestore
      const userDoc = await db.collection('usuarios').doc(userId).get();
      if (!userDoc.exists) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const userData = userDoc.data();
      res.json({ 
          nombre: userData.name, 
          correo: userData.email 
      });
  } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

module.exports = router;