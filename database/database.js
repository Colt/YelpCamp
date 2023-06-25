const { Sequelize } = require('sequelize');
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;

// Create a new Sequelize instance
const sequelize = new Sequelize('yelpcamp', dbUser, dbPassword, {
  host: 'dpg-cht4h80rddlc2m8o0rk0-a.oregon-postgres.render.com',
  port: 5432,
  dialect: 'postgres',
  logging: console.log, // Enable logging of SQL queries
  dialectOptions: {
    ssl: true
  }
});

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = { sequelize };
