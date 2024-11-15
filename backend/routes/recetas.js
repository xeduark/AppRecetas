    const express = require('express');
    const router = express.Router();
    const multer = require('multer');
    const db = require('../config/firebase'); 
    const admin = require('firebase-admin'); 
    const { Storage } = require('@google-cloud/storage');
    const jwt = require('jsonwebtoken'); 
    const path = require('path');

    // Credenciales de Cloud Storage (reemplaza con las tuyas)
    const storage = new Storage({
        keyFilename: path.join(__dirname, '../config/serviceAccountKey.json') 
    });

    const bucket = storage.bucket('app-recetas-6a371.appspot.com');

    // Configurar multer para manejar la carga de archivos
    const upload = multer({
    storage: multer.memoryStorage(), // Guarda la imagen en memoria
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de tamaño (5 MB)
    });

    // Middleware de autenticación
    const authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
      
        if (token == null) return res.status(401).json({ message: 'No autorizado' });
      
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
          if (err) {
            // Si hay un error en la verificación del token
            return res.status(403).json({ message: 'Token inválido' });
          }
      
          // Si el token es válido, asigna el usuario a req.user
          req.user = user; 
          const userId = req.user.uid;
          next(); // Continúa con la ruta
        });
      };

    // Ruta para crear una nueva receta
    router.post('/', authenticateToken, upload.single('imagen'), async (req, res) => {
    const { descripcion, dificultad, name, tiempo, type } = req.body;
    const userId = req.user.uid; // Obtén el ID del usuario autenticado

    if (!name || !descripcion || !dificultad || !tiempo || !type) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    try {
        // Valida el tipo de receta
        if (type !== 'vegetariana' && type !== 'novegetariana') {
            return res.status(400).json({ message: 'El tipo de receta debe ser vegetariana o no vegetariana' });
        }

        // Construye la ruta para Cloud Storage dentro del controlador
        const storagePath = `recetas/${type}/${userId}/${req.file.originalname}`;

        // Subir la imagen a Cloud Storage
        const file = bucket.file(storagePath); 
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        stream.on('error', (err) => {
            console.error('Error al subir la imagen:', err);
            res.status(500).json({ message: 'Error al subir la imagen' });
        });

        stream.on('finish', async () => {
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491' // Fecha de expiración (opcional)
            });

            // Guardar la receta en la base de datos
            const recetaRef = await db.collection('recetas').add({
                descripcion: descripcion,
                dificultad: dificultad,
                imagen: url, // URL de la imagen en Cloud Storage
                name: name,
                tiempo: tiempo,
                type: type,
                userId: userId // Agrega el userId a la receta
            });

            res.status(201).json({ message: 'Receta creada exitosamente', id: recetaRef.id }); 
        });

        stream.end(req.file.buffer); 

    } catch (error) {
        console.error('Error al crear la receta', error);
        res.status(500).json({ message: 'Error al crear la receta' });
    }
    });

    // Ruta para obtener todas las recetas
    router.get('/', async (req, res) => {
        try {
            const recetasSnapshot = await db.collection('recetas').get();
            const recetas = recetasSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            res.status(200).json(recetas);
        } catch (error) {
            console.error('Error al obtener recetas', error);
            res.status(500).json({ message: 'Error al obtener recetas' });
        }
    });

    // Ruta para obtener una receta por ID
    router.get('/:id', async (req, res) => {
        const recetaId = req.params.id;

        try {
            const recetaDoc = await db.collection('recetas').doc(recetaId).get();
            if (!recetaDoc.exists) {
                return res.status(404).json({ message: 'Receta no encontrada' });
            }

            const receta = {
                id: recetaDoc.id,
                ...recetaDoc.data()
            };

            res.status(200).json(receta);
        } catch (error) {
            console.error('Error al obtener la receta', error);
            res.status(500).json({ message: 'Error al obtener la receta' });
        }
    });

    // Ruta para obtener recetas por tipo
    router.get('/type/:type', async (req, res) => {
    const type = req.params.type.toLowerCase(); // Convertir el tipo a minúsculas para evitar problemas de coincidencia

    try {
        const recetasSnapshot = await db.collection('recetas').where('type', '==', type).get();
        const recetas = recetasSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(recetas);
    } catch (error) {
        console.error('Error al obtener recetas', error);
        res.status(500).json({ message: 'Error al obtener recetas' });
    }
    });

    // Ruta para actualizar una receta
    router.put('/:id', authenticateToken, upload.single('imagen'), async (req, res) => {
        const recetaId = req.params.id;
        const { descripcion, dificultad, name, tiempo, type, imagen } = req.body;
        const userId = req.user.uid; 
      
        try {
          const recetaRef = db.collection('recetas').doc(recetaId);
          const recetaSnapshot = await recetaRef.get();
          if (!recetaSnapshot.exists) {
            return res.status(404).json({ message: 'Receta no encontrada' });
          }
      
          // Obtén la URL de la imagen de la base de datos
          const imagenUrl = recetaSnapshot.data().imagen;
      
          let newImagenUrl = imagenUrl; // Valor por defecto es la imagen existente
          if (req.file) {
            const storagePath = `recetas/${type}/${userId}/${req.file.originalname}`;
            const file = bucket.file(storagePath);
            const stream = file.createWriteStream({
              metadata: {
                contentType: req.file.mimetype
              }
            });
            stream.on('error', (err) => {
              console.error('Error al subir la imagen:', err);
              res.status(500).json({ message: 'Error al subir la imagen' });
            });
            stream.on('finish', async () => {
              const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
              });
              newImagenUrl = url; // Actualiza imagenUrl con la URL nueva
            });
            stream.end(req.file.buffer);
          }
      
          await recetaRef.update({
            descripcion: descripcion,
            dificultad: dificultad,
            imagen: newImagenUrl, 
            name: name,
            tiempo: tiempo,
            type: type,
          });
      
          res.status(200).json({ message: 'Receta actualizada exitosamente' });
        } catch (error) {
          console.error('Error al actualizar la receta', error);
          res.status(500).json({ message: 'Error al actualizar la receta' });
        }
      });

    // Ruta para eliminar una receta
    router.delete('/:id', async (req, res) => {
        const recetaId = req.params.id;

        try {
            const recetaRef = db.collection('recetas').doc(recetaId);
            await recetaRef.delete();

            res.status(200).json({ message: 'Receta eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar la receta', error);
            res.status(500).json({ message: 'Error al eliminar la receta' });
        }
    });

    module.exports = router; 