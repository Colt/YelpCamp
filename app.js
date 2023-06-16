if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const { sequelize } = require('./database/database');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('./passportConfig')(passport);
const User = require('./models/models');
const helmet = require('helmet');
const userRoutes = require('./routes/users');
const campRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const bodyParser = require('body-parser');
const dbUser = process.env.DBUSER;
const dbPass = process.env.DBPASSWORD;

const { Session } = require('./models/models');
const pgSession = require('connect-pg-simple')(session);

const port = 8000;

// Connect to PostgreSQL database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync the Session model with the database to create the 'session' table
    await Session.sync();
    console.log('Session table synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
  name: 'session',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: new pgSession({
    conString: `postgres://${dbUser}:${dbPass}@dpg-cht4h80rddlc2m8o0rk0-a.oregon-postgres.render.com/yelpcamp?ssl=true`, // Replace with your PostgreSQL connection string
    tableName: 'session',
    ssl: {
      rejectUnauthorized: false // Set this to false for SSL/TLS connection
    }
  }),
  unset: "destroy" // Added this line to ensure proper session deletion
};

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://cdn.jsdelivr.net",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/djphsccrb/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://wallpaperaccess.com/full/181060.jpg",
              "https://images.unsplash.com/"
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
          'script-src-attr': null

      },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use('/', userRoutes);
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
