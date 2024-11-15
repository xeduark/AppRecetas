// createAdmin.js
const admin = require('firebase-admin');
const bcrypt = require('bcrypt'); // Asegúrate de tener bcrypt instalado
require('dotenv').config();

// Inicializa la aplicación de Firebase
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Inicializa la aplicación de Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Crea la instancia de Firestore
const db = admin.firestore();

const createInitialAdmin = async () => {
    const email = 'xeduark@gmail.com'; // Cambia esto al email deseado
    const name = 'xeduark'; // Nombre del administrador
    const password = 'xoloeduarkore22'; // Cambia esto por una contraseña segura
    const hashedPassword = await bcrypt.hash(password, 10); // Hash de la contraseña

    try {
        // Verifica si el administrador ya existe
        const userSnapshot = await db.collection('usuarios').where('email', '==', email).get();
        if (!userSnapshot.empty) {
            console.log('El administrador ya existe.');
            return;
        }

        // Crear el administrador inicial
        await db.collection('usuarios').add({
            name: name,
            email: email,
            password: hashedPassword,
            type: 'administrador', // Rol de administrador
            fechaCreacion: new Date(),
        });

        console.log('Administrador inicial creado exitosamente.');
    } catch (error) {
        console.error('Error al crear el administrador inicial:', error);
    }
};

// Llama a la función para crear el administrador inicial para ejecutar node crearAdmin.js

createInitialAdmin();
