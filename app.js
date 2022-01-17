const inicioDebug = require('debug')('app:inicio')
const dbDebug = require('debug')('app:db')
const nodemon = require('nodemon');
const express = require('express');
const app = express();
const config = require('config')
const usuarios = require('./routes/usuarios')
const morgan = require('morgan')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api/usuarios', usuarios)
//Logs

if (app.get('env') === 'development') {
    app.use(morgan('tiny'))
    inicioDebug('Morgan on...')
    dbDebug('db on...')
}
//Config
console.log(`Aplicacion ${config.get('nombre')}`)
console.log(`DB server ${config.get('configDB.host')}`)
console.log(app.get('env'))


const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})

