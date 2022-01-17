const inicioDebug = require('debug')('app:inicio')
const dbDebug = require('debug')('app:db')
const express = require('express');
const app = express();
const config = require('config')
const Joi = require('@hapi/joi')
const morgan = require('morgan')
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

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





const usuarios = [{
    id: 1,
    nombre: 'Luciano'
},
{
    id: 2,
    nombre: 'Tekila'
},
{
    id: 3,
    nombre: 'Silvia'
}
]

app.get('/', (req, res) => {
    res.send('Hola mundo');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios)
})

const port = process.env.PORT || 3000;

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = userExist(req.params.id)
    if (!usuario) res.status(404).send('El usuario no fue encontrado')
    res.send(usuario)
})

app.post('/api/usuarios', (req, res) => {
    const { error, value } = userValidation(req.body.nombre)
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuario)
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
    }


})
app.put('/api/usuarios/:id', (req, res) => {
    let usuario = userExist(req.params.id)
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado')
        return;
    }

    const { error, value } = userValidation(req.body.nombre)
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje)
        return;
    }

    usuario.nombre = value.nombre
    res.send(usuario)
})


app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = userExist(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return
    }

    const index = usuarios.indexOf(usuarios)
    usuarios.splice(index, 1)
    res.send(usuarios)
})

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})

function userExist(id) {
    return (usuarios.find(u => u.id === parseInt(id)))
}

function userValidation(name) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required()
    });
    return (schema.validate({ nombre: name }));
}

