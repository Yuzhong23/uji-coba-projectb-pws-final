module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  User.associate = (models) => {
    User.hasMany(models.ApiKey, {
      foreignKey: 'user_id',
      as: 'apiKeys',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
