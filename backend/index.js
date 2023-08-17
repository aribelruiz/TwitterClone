const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({
    // Set the browser cache time for preflight responses
    maxAge: 86400,
    preflightContinue: true // Allow us to manually add to preflights
}));

const { Sequelize } = require('sequelize');
const db = require('./models');

// Routers
const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);


const sequelize = new Sequelize("mysql://root:Pa$$word3!@localhost:3306/fullstackpractice");

// Establishing database connection
sequelize.authenticate().then( () => {
    console.log('Connection has been established successfully.');
}).catch ((error) =>  {
    console.error('Unable to connect to the database:', error);
});

// Set port, listen for requests
const PORT = 8080;
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });    
});
