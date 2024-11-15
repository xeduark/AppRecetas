import React, { useState } from 'react';

const CreateAdminForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Realizar la solicitud POST a la API para crear un administrador
            const response = await fetch('http://localhost:5000/api/auth/login/create-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Agregar el token de autenticación
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Administrador creado exitosamente');
                setErrorMessage('');
                // Limpiar los campos del formulario
                setName('');
                setEmail('');
                setPassword('');
            } else {
                setErrorMessage(data.message || 'Error al crear el administrador');
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Error en la conexión con el servidor');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <h2>Crear Administrador</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear Administrador</button>
            </form>
        </div>
    );
};

export default CreateAdminForm;
