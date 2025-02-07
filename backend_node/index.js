const express = require("express");
const app = express();
const db = require('./db');
require('dotenv').config();
const PORT=process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

const userroute = require('./route/userProfile');
const mealroute=require('./route/meal');

app.use('/user', userroute);
app.use('/meal',mealroute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
