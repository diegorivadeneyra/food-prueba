const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Entradas', 'Platos Principales', 'Postres', 'Bebidas', 'Pizzas', 'Pastas', 'Ensaladas']
  },
  ingredientes: [{
    type: String,
    trim: true
  }],
  disponible: {
    type: Boolean,
    default: true
  },
  tiempo_preparacion: {
    type: Number,
    required: true,
    min: 1
  },
  imagen_url: {
    type: String,
    default: 'default-food.jpg'
  },
  vegetariano: {
    type: Boolean,
    default: false
  },
  vegano: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);