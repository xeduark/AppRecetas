const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();

// RUTAS
const authRoutes = require('./routes/auth');
const recetasRoutes = require('./routes/recetas');
const usuarioRoutes = require('./routes/usuarios');
const graficosRoutes = require('./routes/graficos');


// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://tu-dominio.com', 'http://127.0.0.1:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/graficos', graficosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor de Express funcionando!');
});

// Manejo de errores (ejemplo básico)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error del servidor.' });
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

// ICONO DEL SERVIDOR
app.get('/logoReceta.png', (req, res) => {
  res.sendFile(__dirname + '../public/vite.svg');
});