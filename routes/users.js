const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/models');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
  .get((req, res, next) => {
    if (req.isAuthenticated()) {
      // If the user is already authenticated, redirect them to another page
      return res.redirect('/');
    }
    // If the user is not authenticated, render the login page
    return users.renderLogin(req, res, next);
  })
  .post(passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }), users.login);

router.get('/logout', users.logout)

module.exports = router;
