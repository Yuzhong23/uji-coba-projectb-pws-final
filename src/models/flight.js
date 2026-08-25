module.exports = (sequelize, DataTypes) => {
  const Flight = sequelize.define('Flight', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    flight_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    departure_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    arrival_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'Scheduled'
    }
  }, {
    tableName: 'flights',
    timestamps: false
  });

  Flight.associate = (models) => {
    Flight.belongsTo(models.Airline, {
      foreignKey: 'airline_id',
      as: 'airline',
      onDelete: 'CASCADE'
    });
    Flight.belongsTo(models.Airport, {
      foreignKey: 'origin_airport_id',
      as: 'origin',
      onDelete: 'CASCADE'
    });
    Flight.belongsTo(models.Airport, {
      foreignKey: 'destination_airport_id',
      as: 'destination',
      onDelete: 'CASCADE'
    });
  };

  return Flight;
};
