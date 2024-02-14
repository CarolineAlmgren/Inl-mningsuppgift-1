'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RockBand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RockBand.init({
    name: DataTypes.STRING,
    from: DataTypes.STRING,
    founded: DataTypes.INTEGER,
    albums: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RockBand',
  });
  return RockBand;
};