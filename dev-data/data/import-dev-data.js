const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, './../../config.env') });

const DB_URI = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
mongoose
  .connect(DB_URI)
  .then(() => console.log("DB connection successful"));

const tours = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tours.json'), 'utf-8'));
const users = JSON.parse(fs.readFileSync(path.resolve(__dirname, './users.json'), 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(path.resolve(__dirname, './reviews.json'), 'utf-8'));

const importData = async () =>{
    try{
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data successfully loaded');
        process.exit();
    }catch(err){
        console.log(err);
    }
}

//Delete all data from collection
const deleteData = async() =>{
    try{
        await Tour.deleteMany();
        await Review.deleteMany();
        await User.deleteMany();
        console.log('Data successfully deleted');
        process.exit();
    }catch(err){
        console.log(err);
    }
}
if(process.argv[2] === '--import'){
    importData();
}else if (process.argv[2]==='--delete'){
    deleteData();
}
