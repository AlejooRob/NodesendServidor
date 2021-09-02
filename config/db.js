const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});

const conectarDB = async () => {

    const url =process.env.DB_URL;
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarDB;