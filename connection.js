const mysql = require('mysql2');
require('dotenv').config();

var connection = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'229225111MySQL',
        database:'CMS'
    }
);

connection.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Database connected');
    }
});

module.exports = connection;