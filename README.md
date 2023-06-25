# YelpCamp-Postgres
An overhaul of Colt Steele's [YelpCamp](https://github.com/Colt/YelpCamp) project to use Postgres instead of MongoDB. A great demonstration of the contrast between relational and non-relational databases and their implementation in CRUD apps.

Deployed Website: https://yelpcamp-0qtg.onrender.com

Packages added:-
--------
  1) "sequelize": "^6.31.1" Object-Relational Mapper to interact with the database (replacing mongoose)
  2) "bcrypt": "^5.1.0"  To encrypt the registered user's password before storing it in the database (replacing passport-local-mongoose)
  3) "pg": "^8.10.0",    To interact with PostgreSQL databases using raw SQL queries.
  4) "connect-pg-simple": "^8.0.0"   To store the Session data in the database (replacing connect-mongo)
 
Packages removed:-
--------
  1) "mongoose": "^7.0.1"
  2) "passport-local-mongoose": "^8.0.0",
  3) "connect-mongo": "^5.0.0",
  4) "express-mongo-sanitize": "^2.2.0"

Files added:-
--------
  1) "./passportConfig.js" (Passport.js configuration file).
  2) "./database/database.js" (Sequilize configuration file).
  3) "./database/db.js" (pg configuration file).
  4) "./models/models.js" (Postgres Models file).
  5) "./public/scripts/bootstrap.bundle.min.js, bootstrap.bundle.min.js.map, bootstrap.min.js, bootstrap.min.js.map" (bootstrap local files CDN is not needed).
  6) "./public/stylesheets/bootstrap.min.css, bootstrap.min.css" (bootstrap local files CDN is not needed).

Files removed:-
--------
  1) "./models/campground.js, user.js, review.js" (MongoDB schemas no longer needed).
  2) "./public/stylesheets/app.css".
  3) Changed the name of "./public/javascripts" to "./public/scripts".

Third-party apps:-
--------
  1) pgadmin (GUI to interact with Postgres Databases)
  https://www.pgadmin.org/

Creating the Postgres database:-
--------
  __-Local:-__
  1) Install Postgres
     https://www.postgresql.org/download/
  2) Start the server
     ```bash
       sudo systemctl start postgresql
     ```
     or  
     ```bash
       sudo pg_ctlcluster 15  main start
     ```
  3) Connect to the server using default credintals
     ```bash
       sudo -u postgres psql -p 5432 
     ```
  4) Create a new user and grant it the required priveleges to create a database
     ```
       CREATE USER newser WITH PASSWORD 'newpass' CREATEDB;
     ```
  5) Register your server and connect to the newly created user using pgadmin
     ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/b0dd5406-f3ac-458c-99ac-b74518b6892f)
     ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/e071c496-28c0-4eaa-b476-0c8ad025dda3)
     ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/a7c14257-11a3-41b0-ad53-07c7789c5eb3)

  6) Create a new database
     ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/ab16dd66-25d8-48a6-abb4-39dc66ace4be)
     ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/470d218f-98db-4e35-aabd-f530422ba103)

  __-Or we could set up a cloud database using [render](https://render.com/) and connect to it in the same manner:-__
  1) Create a new database on render
  ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/221333b2-1e4a-46a6-b295-6480ccc62041)

  2) Connect to the database
  ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/b0dd5406-f3ac-458c-99ac-b74518b6892f)
  ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/5aaf4dff-3996-49e0-872e-6b6c3aa6a7cc)
  ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/cc594eba-bde2-42ac-b209-baa93b7da3e2)

Database extensions:-
--------
After connecting to the database a couple extensions have to be installed in order to provide spatial database capabilities, including support for geographic data types. We use the Query Tool in pgadmin to install them.
  1) postgis 
  2) postgis-topology

  ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/83600cf4-94e5-4c6c-bb2b-dacdb7df9ce3)
  ![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/e437eaf3-1d1d-4277-bfd5-4f55f7f758fd)

Creating the database tables:-
--------
  We set up our database tables and the necessary relations between them using the following SQL queries and pgadmin's Query Tool.

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP,
      "updatedAt" TIMESTAMP
    );

    CREATE TABLE campgrounds (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      price FLOAT NOT NULL,
      images JSONB[] NOT NULL,
      geometry GEOGRAPHY(POINT) NOT NULL,
      description VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      authorid INTEGER NOT NULL REFERENCES users (id),
      "createdAt" TIMESTAMP,
      "updatedAt" TIMESTAMP
    );
  
    CREATE TABLE reviews (
      id SERIAL PRIMARY KEY,
      body VARCHAR(255) NOT NULL,
      rating INTEGER NOT NULL,
      "createdAt" TIMESTAMP,
      "updatedAt" TIMESTAMP,
      campgroundid INTEGER NOT NULL REFERENCES campgrounds (id),
      authorid INTEGER NOT NULL REFERENCES users (id)
    );

![image](https://github.com/X0Rhyth/YelpCamp-Postgres/assets/134970522/0ee04298-5871-4681-ae47-3aa8d47dfe8f)


*Now we are good to go. Feel free to ask any questions.

  
