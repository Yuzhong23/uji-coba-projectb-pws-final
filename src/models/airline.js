module.exports = (sequelize, DataTypes) => {
  const Airline = sequelize.define('Airline', {
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
    callsign: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'airlines',
    timestamps: false
  });

  Airline.associate = (models) => {
    Airline.hasMany(models.Flight, { foreignKey: 'airline_id', as: 'flights' });
  };

  return Airline;
};
