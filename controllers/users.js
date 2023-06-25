const {User} = require('../models/models');
const db = require('../database/db.js');
const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res) => {
  try {
    // Sync the User model with the database (create the "users" table)
    await User.sync();
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id'; // Add 'RETURNING id' to get the inserted user's ID
    await db.query(query, [email, username, hashedPassword]);
    const user = await User.findOne({ where: { email: email } });
    req.login(user, (err) => {
      if (err) throw err;
      req.flash('success', 'Registered');
      res.redirect('/campgrounds');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login', { message: req.flash('error') });
};

module.exports.login = (req,res) => {
  req.flash("success", "Login Successful");
  res.redirect('/campgrounds')
}

module.exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logout Successful');
    res.redirect('/campgrounds');
  });
};
