require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const menuRoutes = require('./routes/menuRoutes');

// Inicializar Express
const app = express();

// Conectar a la base de datos
connectDB();
const seedMenu = require('./seeds/menuSeeder');
seedMenu(); // Ejecuta el seeder al iniciar el servidor

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Microservicio de Menú funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rutas principales
app.use('/api/v1/menu', menuRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    message: 'FoodFlow Menu API',
    version: '1.0.0',
    health: '/health'
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
  console.log(`🚀 Servidor ms-menu ejecutándose en puerto ${PORT}`);
  console.log(`❤️ Health check en http://localhost:${PORT}/health`);
});

module.exports = app;