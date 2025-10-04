const MenuItem = require('../models/Menu');

// Obtener todos los elementos del menú
const getAllMenuItems = async (req, res) => {
  try {
    const { categoria, disponible, limit = 50, skip = 0 } = req.query;
    
    let filter = {};
    
    if (categoria) {
      filter.categoria = categoria;
    }
    
    if (disponible !== undefined) {
      filter.disponible = disponible === 'true';
    }

    const menuItems = await MenuItem.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ categoria: 1, nombre: 1 });

    const total = await MenuItem.countDocuments(filter);

    res.json({
      success: true,
      data: menuItems,
      pagination: {
        total,
        count: menuItems.length,
        limit: parseInt(limit),
        skip: parseInt(skip)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener elementos del menú',
      error: error.message
    });
  }
};

// Obtener elemento del menú por ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Elemento del menú no encontrado'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener elemento del menú',
      error: error.message
    });
  }
};

// Obtener elementos por categoría
const getMenuItemsByCategory = async (req, res) => {
  try {
    const { categoria } = req.params;
    const menuItems = await MenuItem.find({ 
      categoria,
      disponible: true 
    }).sort({ nombre: 1 });

    res.json({
      success: true,
      data: menuItems,
      count: menuItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener elementos por categoría',
      error: error.message
    });
  }
};

// Crear nuevo elemento del menú
const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Elemento del menú creado exitosamente',
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear elemento del menú',
      error: error.message
    });
  }
};

// Actualizar elemento del menú
const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Elemento del menú no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Elemento del menú actualizado exitosamente',
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar elemento del menú',
      error: error.message
    });
  }
};

// Eliminar elemento del menú
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Elemento del menú no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Elemento del menú eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar elemento del menú',
      error: error.message
    });
  }
};

// Obtener todas las categorías disponibles
const getCategories = async (req, res) => {
  try {
    const categories = await MenuItem.distinct('categoria');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getCategories
};