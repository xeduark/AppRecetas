import React, { useState } from "react";
import styles from "./login.module.css";
import PopupError from "../layouts/PopupError";
import PopupChangeP from "../layouts/PopupChangeP";
import PopupCorrect from "../layouts/popupCorrect";
import Loader from "../layouts/Loader";
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2'; 

const LoginForm = () => {
  //Estado para la transisición
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader

  // Estado para alternar entre el panel de registro y el de inicio de sesión
  const [rightPanelActive, setRightPanelActive] = useState(false);

  // estados para manejar el email y la contraseña introducidos por el usuario
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  //Estado para manejar el modal de confirmación de registro
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  //FUNCION AUXILIAR PARA MANEJAR ERRORES
  const handleError = (error) => {
    console.error(error);
    setMessage("Error al conectar con el servidor");
    setShowErrorPopup(true);
  };

  // Función para logearse
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        setMessage("Inicio de sesión exitoso");
        localStorage.setItem("authToken", data.token); // Guardar token de manera local
        localStorage.setItem("userId", data.userId);

        // Decodificar el token para obtener el tipo de usuario
        const decodedToken = jwtDecode(data.token);
        localStorage.setItem("userType", decodedToken.type); // Guardar el tipo de usuario

        // LIMPIAR CAMPOS DESPUES DEL INICIO DE SESION
        setEmail("");
        setPassword("");
        setIsLoading(true);

        setTimeout(() => {
          navigate("/estadisticas"); // Redirige al dashboard
        }, 1500); // Tiempo de espera en milisegundos (1.5 segundos)

        setTimeout(() => {
          setIsLoading(false);
        }, 2500); // Tiempo de espera en milisegundos (2.5 segundos)
      } else {
        setMessage(data.message || "Error al iniciar sesión");
        setShowErrorPopup(true);
        console.error("Error al iniciar sesión:", data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Función para registrarse

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ name, email, password, type: "usuario" }), 
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Registro exitoso
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'El usuario se ha registrado correctamente.',
          showConfirmButton: false,
          timer: 1500 // Cierra automáticamente después de 1.5 segundos
        }).then(() => {
          // Limpiar campos después de que el SweetAlert se cierre
          setName("");
          setEmail("");
          setPassword("");
        });
      } else {
        // Error en el registro
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: data.message || "Error al registrar el usuario",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
    }
  };

  // Estado para mostrar el popup de error
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  // Estado para mostrar el popup de "Olvidaste tu contraseña"
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);

  // Función que muestra el formulario de registro
  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  // Función que muestra el formulario de inicio de sesión
  const handleSignInClick = () => {
    setRightPanelActive(false);
  };

  // Función para cerrar el popup de error
  const closeErrorPopup = () => {
    setShowErrorPopup(false);
  };

  // Función para cerrar el popup de "Olvidaste tu contraseña"
  const closeForgotPasswordPopup = () => {
    setShowForgotPasswordPopup(false);
  };

  // Función para manejar el envío del formulario de recuperación de contraseña
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario de recuperación de contraseña
    console.log("Correo de recuperación enviado");
    setShowForgotPasswordPopup(false);
  };

  return (
    <div className={styles.mainContainer}>
      {isLoading && <Loader />}
      {/* Mostrar popup de error si está activado */}
      {showErrorPopup && <PopupError onClose={closeErrorPopup} />}

      {/* Mostrar popup de "Olvidaste tu contraseña" si está activado */}
      {showForgotPasswordPopup && (
        <PopupChangeP
          onClose={closeForgotPasswordPopup}
          submit={handleForgotPasswordSubmit}
        />
      )}

      <div
        className={`${styles.container} ${
          rightPanelActive ? styles.containerRightPanelActive : ""
        }`}
        id="container"
      >
        {/* Formulario de registro */}

        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form
            className={styles.formulario}
            action="#"
            onSubmit={handleRegister}
          >
            {/*AQUI ESTAMOS PASANDO LA FUNCION PARA REGISTRAR */}
            <h1 className={styles.tituloForm}>Crear Cuenta</h1>
            <div className={styles.socialContainer}>
              <Link to="" className={styles.social}>
                <FaFacebookF />
              </Link>
              <Link to="" className={styles.social}>
                <FaGooglePlusG />
              </Link>
              <Link to="" className={styles.social}>
                <FaLinkedinIn />
              </Link>
            </div>
            <span className={styles.parrafoForm}>
              o usa tu correo electrónico para registrarte
            </span>
            <input
              className={styles.inputBox}
              type="text"
              placeholder="Nombre"
              id="nameRegister"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className={styles.inputBox}
              type="email"
              placeholder="Correo Electrónico"
              id="emailRegister"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={styles.inputBox}
              type="password"
              placeholder="Contraseña"
              id="passwordRegister"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className={styles.btnLog} type="submit">
              Regístrar <GiKnifeFork />
            </button>
          </form>
          {/* Usar el modal de confirmacion de registro */}
          <PopupCorrect
            isOpen={modalIsOpen}
            onClosed={closeModal}
            message={message}
          />
        </div>

        {/* Formulario de inicio de sesión */}
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.formulario} onSubmit={handleLoginSubmit}>
            <h1 className={styles.tituloForm}>Iniciar Sesión</h1>
            <div className={styles.socialContainer}>
              <Link to="" className={styles.social}>
                <FaFacebookF />
              </Link>
              <Link to="" className={styles.social}>
                <FaGooglePlusG />
              </Link>
              <Link to="" className={styles.social}>
                <FaLinkedinIn />
              </Link>
            </div>
            <span className={styles.parrafoForm}>o usa tu cuenta</span>
            <input
              className={styles.inputBox}
              type="email"
              placeholder="Correo Electrónico"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Actualiza el estado 'email' cuando cambia el valor
              required
            />
            <input
              className={styles.inputBox}
              type="password"
              placeholder="Contraseña"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Actualiza el estado 'password' cuando cambia el valor
              required
            />
            <Link
              className={styles.olvidoPass}
              onClick={() => setShowForgotPasswordPopup(true)} // Mostrar el popup cuando se haga clic en el enlace
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <button type="submit" className={styles.btnLog}>
              Iniciar Sesión <GiKnifeFork />
            </button>
          </form>
        </div>

        {/* Panel de superposición */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1 className={styles.tituloForm}>¡Bienvenido de Nuevo!</h1>
              <p className={styles.parrafo}>
                Para mantenerte conectado con nosotros, por favor inicia sesión
                con tu información personal
              </p>
              <button
                className={styles.ghost}
                id="signIn"
                onClick={handleSignInClick}
              >
                Iniciar Sesión
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1 className={styles.tituloForm}>¡Hola, Amigo!</h1>
              <p className={styles.parrafo}>
                Ingresa tus datos personales y comienza tu viaje con nosotros
              </p>
              <button
                className={styles.ghost}
                id="signUp"
                onClick={handleSignUpClick}
              >
                Regístrate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
