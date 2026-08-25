module.exports = (sequelize, DataTypes) => {
  const ApiKey = sequelize.define('ApiKey', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'api_keys',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  ApiKey.associate = (models) => {
    ApiKey.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return ApiKey;
};
