const express = require('express');
const router = express.Router();
const db = require('../config/firebase');
const bcrypt = require('bcrypt'); // Para manejar el cifrado de contraseñas
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { name, email, password, type } = req.body;

    if (!name || !email || !password || !type) {
        return res.status(400).json({ message: 'El Nombre, Correo, Contraseña y Tipo son requeridos' });
    }

    try {
        // Verifica si el usuario ya existe
        const userSnapshot = await db.collection('usuarios').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el nuevo usuario
        await db.collection('usuarios').add({
            name: name,
            email: email,
            password: hashedPassword,
            type: type, // Guardar el tipo aquí
            fechaCreacion: new Date(),
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// Ruta para iniciar sesión 
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Datos recibidos:', { email, password }); // Agrega este log

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    try {
        // Buscar el usuario
        const userSnapshot = await db.collection('usuarios').where('email', '==', email).get();
        if (userSnapshot.empty) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = userSnapshot.docs[0].data();

        // Verificar la contraseña
        const match = await bcrypt.compare(password, user.password);
        console.log('Coincide la contraseña:', match); // Agrega este log
        if (!match) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar un token JWT incluyendo el tipo de usuario
        const token = jwt.sign(
            { uid: userSnapshot.docs[0].id, type: user.type }, // Incluye el tipo de usuario
            JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        console.log('Token generado:', token);

        // Responder con éxito
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

// Ruta para crear un nuevo administrador
router.post('/create-admin', async (req, res) => {
    const { name, email, password } = req.body;
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado

    if (!token) {
        return res.status(403).json({ message: 'No autorizado' });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
        
        // Buscar el usuario que hizo la solicitud
        const adminSnapshot = await db.collection('usuarios').doc(decodedToken.uid).get();
        if (!adminSnapshot.exists || adminSnapshot.data().type !== 'administrador') {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        // Verificar si el nuevo administrador ya existe
        const userSnapshot = await db.collection('usuarios').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            return res.status(409).json({ message: 'El administrador ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el nuevo administrador
        await db.collection('usuarios').add({
            name: name,
            email: email,
            password: hashedPassword,
            type: 'administrador', // Asignar el rol de administrador
            fechaCreacion: new Date(),
        });

        res.status(201).json({ message: 'Administrador creado exitosamente' });
    } catch (error) {
        console.error('Error al crear administrador', error);
        res.status(500).json({ message: 'Error al crear administrador' });
    }
});

module.exports = router;
