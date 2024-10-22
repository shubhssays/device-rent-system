'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Seed data for 20 electronic devices
    const devices = [
      {
        "name": "MacBook Pro",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Dell XPS 13",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "HP Spectre x360",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "iPhone 14",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Samsung Galaxy S21",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Google Pixel 6",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Lenovo ThinkPad X1 Carbon",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Microsoft Surface Laptop 4",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Sony Xperia 5 II",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Asus ROG Zephyrus G14",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "OnePlus 9 Pro",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Acer Predator Helios 300",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Huawei MateBook X Pro",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Xiaomi Mi 11",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Razer Blade 15",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "iPad Pro",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Samsung Galaxy Tab S7",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Google Nest Hub",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Amazon Echo Dot",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      },
      {
        "name": "Apple Watch Series 7",
        "isAvailable": true,
        "createdAt": new Date(),
        "updatedAt": new Date()
      }
    ]

    // Insert the devices into the database
    await queryInterface.bulkInsert('Devices', devices, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the inserted devices
    await queryInterface.bulkDelete('Devices', null, {});
  }
};