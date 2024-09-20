'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Options', [{
      optionId: 122,
      price: 100.00,
      productCode: 'or100',
      quantity: 1,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Options', null, {});
  }
};
