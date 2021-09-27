const express = require('express');
const app = express();

app.use(express.json());
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
    res.send(['Luciano', 'Tekila', 'Silvia'])
})

const port = process.env.PORT || 3000;

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = usuarios.find(u => u.id === parseInt(req.params.id))
    if (!usuario) res.status(404).send('El usuario no fue encontrado')
    res.send(usuario)
})

app.post('/api/usuarios', (req,res) => {
    if(!req.body.nombre || req.body.nombre.length <= 2){
        res.status(404).send('Debe ingresar un nombre');
        return;
    }
    const usuario = {
        id: usuarios.length + 1,
        nombre: req.body.nombre
    }
    usuarios.push(usuario);
    res.send(usuario)
})


app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}...`);
})