require('dotenv').config();
const mongoose = require('mongoose');
const faker = require('faker');
const MenuItem = require('../models/Menu');

// Configurar faker en español
faker.locale = 'es';

const categorias = ['Entradas', 'Platos Principales', 'Postres', 'Bebidas', 'Pizzas', 'Pastas', 'Ensaladas'];

const nombresComida = {
  'Entradas': ['Bruschetta Clásica', 'Tabla de Quesos', 'Empanadas Criollas', 'Ceviche de Pescado'],
  'Platos Principales': ['Lomo Saltado', 'Pollo a la Brasa', 'Salmón Grillado', 'Arroz con Pollo'],
  'Postres': ['Tiramisú', 'Cheesecake de Fresa', 'Brownie con Helado', 'Flan de Vainilla'],
  'Bebidas': ['Limonada Natural', 'Chicha Morada', 'Jugo de Naranja', 'Coca Cola'],
  'Pizzas': ['Pizza Margherita', 'Pizza Pepperoni', 'Pizza Hawaiana', 'Pizza Cuatro Quesos'],
  'Pastas': ['Spaghetti Boloñesa', 'Fettuccine Alfredo', 'Penne Arrabbiata', 'Lasagna Clásica'],
  'Ensaladas': ['Ensalada César', 'Ensalada Griega', 'Ensalada Caprese', 'Ensalada Mixta']
};

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado para seeding');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const generarMenuItems = async () => {
  try {
    const count = await MenuItem.countDocuments();
    if (count > 0) {
      console.log(`🟡 Seeding omitido: ya existen ${count} platos.`);
      return;
    }
    
    console.log('Eliminando datos existentes...');
    await MenuItem.deleteMany({});

    console.log('Generando elementos del menú...');
    const menuItems = [];

    for (const categoria of categorias) {
      const nombres = nombresComida[categoria];
      for (const nombreBase of nombres) {
        const menuItem = {
          nombre: nombreBase,
          descripcion: faker.random.arrayElement([
            'Deliciosa preparación casera con ingredientes frescos.',
            'Ideal para compartir en familia.',
            'Sabor auténtico con toque tradicional.',
            'Receta inspirada en la cocina peruana.',
            'Perfecto para acompañar con una bebida fría.',
            'Textura suave y sabor intenso.'
          ]),
          precio: faker.datatype.number({ min: 5, max: 80, precision: 0.1 }),
          categoria: categoria,
          ingredientes: faker.helpers.shuffle([
            'tomate', 'queso', 'pollo', 'cebolla', 'pimiento', 'ajo',
            'aceite de oliva', 'albahaca', 'carne', 'arroz', 'papa',
            'limón', 'chocolate', 'harina', 'leche'
          ]).slice(0, faker.datatype.number({ min: 2, max: 6 })),
          disponible: faker.datatype.boolean(),
          tiempo_preparacion: faker.datatype.number({ min: 5, max: 45 }),
          imagen_url: `${categoria.toLowerCase()}-${nombreBase.replace(/\s+/g, '-')}.jpg`,
          vegetariano: faker.random.boolean(),
          vegano: faker.datatype.boolean()
        };

        menuItems.push(menuItem);
      }
    }
    console.log(`Total a insertar: ${menuItems.length}`);

    await MenuItem.insertMany(menuItems);
    console.log(`${menuItems.length} elementos del menú creados exitosamente`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error generando datos:', error);
    process.exit(1);
  }
};

module.exports = async function seedMenu() {
  await conectarDB();
  await generarMenuItems();
};
