const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Creando el servidor
const app = express();

//Conectando la base de datos
conectarDB();

//Habilitar Cors
const optionsCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(optionsCors));

//Puerto de la app
const port = process.env.PORT || 4000;

//Habilitar valores para el body
app.use(express.json());

//Habiltar carpeta publica
app.use( express.static('uploads'));

//Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

//Arrancando la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})