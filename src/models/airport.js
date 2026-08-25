module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define('Airport', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    iata_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'airports',
    timestamps: false
  });

  Airport.associate = (models) => {
    Airport.hasMany(models.Flight, { foreignKey: 'origin_airport_id', as: 'Departures' });
    Airport.hasMany(models.Flight, { foreignKey: 'destination_airport_id', as: 'Arrivals' });
  };

  return Airport;
};
