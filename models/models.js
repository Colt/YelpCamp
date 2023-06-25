const { sequelize } = require('../database/database'); // Assuming you have a Sequelize instance named "sequelize";
const { DataTypes } = require('sequelize');



const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'users'
});

const Session = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  sess: {
    type: DataTypes.JSON,
    allowNull: false
  },
  expire: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'session', // Set the table name explicitly
  timestamps: false // Disable timestamps for this table
});




const Campground = sequelize.define('Campground', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.JSONB),
    allowNull: false
  },
  geometry: {
    type: DataTypes.GEOMETRY('POINT'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  authorid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User', // Make sure it matches the name of the User model
      key: 'id', // Primary key column of the User model
    },
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'campgrounds'
});

const Review = sequelize.define('Review', {
  body: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  authorid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User', // Make sure it matches the name of the User model
      key: 'id', // Primary key column of the User model
    },
  },
  campgroundid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Campground', // Make sure it matches the name of the User model
      key: 'id', // Primary key column of the User model
    },
  },
}, {
  tableName: 'reviews'
});


Campground.belongsTo(User, { foreignKey: 'authorid', as: 'author' });
Review.belongsTo(User, { foreignKey: 'authorid', as: 'author' });
Campground.hasMany(Review, { foreignKey: 'campgroundid', as: 'reviews' });
// Additional model associations or hooks can be defined here



module.exports = {
  User,
  Session,
  Campground,
  Review,
};

