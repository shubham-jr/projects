const app = require('express')();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const movieModel = require('./../../models/movieModel');
dotenv.config({path:'./config.env'});
const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
const port = process.env.PORT;

mongoose.connect(DB,{
    useNewUrlParser:true,
	useUnifiedTopology:true
})
.then(conn=>{console.log('database connected....')})
.catch(err=>{console.log(err)});


app.listen(9999,'127.0.0.1',()=>{
    console.log(`server running at port ${port}`);
});
const movieData = JSON.parse(fs.readFileSync(`${__dirname}/moviesData.json`,'utf-8'));
console.log(fs.readFileSync(`${__dirname}/moviesData.json`,'utf-8'));
const importData=async()=>{
try
{
    await movieModel.create(movieData);
    console.log('data succesfully imported');
}catch(err)
{
 console.log(err);
}
process.exit();
}

const deleteData=async()=>{
    try
    {
        await movieModel.deleteMany();
        console.log('data succesfully deleted');
    }catch(err)
    {
        console.log(err);
    }
    process.exit();
}

if(process.argv[2]=='--import')
importData();

if(process.argv[2]=='--delete')
deleteData();

