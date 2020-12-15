'use strict';
const express = require('express');
require('dotenv').config();
const pg = require('pg');
const superagent = require('superagent');
const methodOverride =require('method-override');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.render('index');
});

//routes 
app.get('/search', searchHandle);
app.post('result',addtoCallhandle);
app.get('/getfromdb', gitFromdb);
app.put('ubdate',updateDB);
app.delete('delete',deleteFromdb);


// functions 
function searchHandle(req,res){
    let country = req.query.county;
    let from = req.query.from
    console.log(from);
    let to = req.query.to
    console.log(to);
    const url =`https://api.covid19api.com/country/${country}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`;
    superagent.get(url)
    .then(data=>
        let array = data.body.Countries.map(item=>{
            return new country(item);
        })
    
        res.render('result',{object:array});
     } ) ;   


    console.log(country);

function addtoCallhandle(req,res){
    let sql= `INSERT TO covidd (country,TotalConfirmed,TotalDeaths,TotalRecovered,Date)VALUES($1,$2,$3,$4,$5) RETURNENIG id;`
    let {country,TotalConfirmed,TotalDeaths,TotalRecovered,Date}= req.body;
    let values= [country,TotalConfirmed,TotalDeaths,TotalRecovered,Date];
client.query(sql,values)
    .then(()=>{
        res.redirect('/result');

    })


}
function getfromdb (res,req){
    let sql = `select * from covidd;`
    client.query(sql)
    .then(()=> {
        res.render('/deathes',object.Countries.rows);
    }
}
function updateDB (res,req){
    let id= req.params.id;
    let sql =`UPDATE covidd SET country=$1,TotalConfirmed=$2,TotalDeaths=$3,TotalRecovered=$4,Date=$5 where id =$6; `;
    let {country,TotalConfirmed,TotalDeaths,TotalRecovered,Date}= req.body;
    let values= [country,TotalConfirmed,TotalDeaths,TotalRecovered,Date,id];

    client.query(sql,values)
    .then(()=>{
        res.redirect('/details');

    })


}
function deleteFromdb(req,res){
    let sql = `DELETE FROM covidd where id=$1;`;

    let Values = [req.query.param.id]

    client.query(sql,values)
    .then(()=>{
        res.redirect('/countryDetails');

    })

}





function Country (data){
    this.country = data.Country;
    this.TotalConfirmed= data.TotalConfirmed;
    this.TotalDeaths=data.TotalDeaths;
    this.TotalRecovered=data.recovered;
    this.Date=data.Date
}


client.connect()
.then (()=>{
app.listen (PORT,()=>{
console.log(`iam here ${PORT}`)
});
});