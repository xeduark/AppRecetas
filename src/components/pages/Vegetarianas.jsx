import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../styles/vegetarianas.module.css";
import { GiFruitBowl } from "react-icons/gi";
import { IoAdd } from "react-icons/io5";
import Swal from 'sweetalert2';

const Vegetarianas = () => {
  const [recetas, setRecetas] = useState([]); // Hook para manejar el estado de las recetas

  // Estado para manejar la carta
  const [openId, setOpenId] = useState(null);

  // Obtener el tipo de usuario
  const userType = localStorage.getItem("userType");

  const verDetalles = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id)); // Alternar el estado
  };

  useEffect(() => {
    console.log("Tipo de usuario:", userType);
    const fetchRecetas = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/recetas/type/vegetariana"
        ); // URL correcta
        if (!response.ok) {
          throw new Error("Error al obtener las recetas");
        }
        const data = await response.json();
        setRecetas(data);
      } catch (error) {
        console.log("Error trayendo recetas", error);
      }
    };
    fetchRecetas();
  }, []);

  // Función para manejar la eliminación de la receta
  const handleDelete = async (id) => {
    if (userType !== "administrador") {
      Swal.fire({
        icon: 'warning',
        title: '¡Acceso denegado!',
        text: 'No tienes permisos para eliminar esta receta.',
      });
      return; // Detener la ejecución de la función
    }

    // Preguntar al usuario si está seguro de eliminar la receta
    const result = await Swal.fire({
      title: "¿Estás seguro de que deseas eliminar esta receta?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        // Obtener el ID del usuario
        const userId = localStorage.getItem("userId"); 

        const response = await fetch(
          `http://localhost:5000/api/recetas/${id}?userId=${userId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // La receta se eliminó correctamente
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Receta eliminada!",
            showConfirmButton: false,
            timer: 1500 // Cierra automáticamente después de 1.5 segundos
          });

          // Actualiza el estado de las recetas
          setRecetas((prevRecetas) =>
            prevRecetas.filter((receta) => receta.id !== id)
          );
          console.log("Receta eliminada correctamente");
        } else {
          // Error al eliminar la receta
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Error al eliminar",
            showConfirmButton: false,
            timer: 1500 
          });
          throw new Error("Error al eliminar la receta"); 
        }
      } catch (error) {
        // Error al conectar al servidor o error al eliminar
        console.error("Error al eliminar la receta:", error);

        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error de conexión",
          showConfirmButton: false,
          timer: 1500 
        });
      }
    }
  };

  // Función para manejar el intento de crear una receta
  const handleCreate = () => {
    if (userType !== "administrador") {
      Swal.fire({
        icon: 'warning',
        title: '¡Acceso denegado!',
        text: 'No tienes permisos para crear recetas.',
      });
      return; // Detener la ejecución de la función
    }
  };

  // Función para manejar el intento de editar una receta
  const handleEdit = (id) => {
    if (userType !== "administrador") {
      Swal.fire({
        icon: 'warning',
        title: '¡Acceso denegado!',
        text: 'No tienes permisos para editar esta receta.',
      });
      return; // Detener la ejecución de la función
    }

     // Redirige a la página de edición si el usuario es administrador
     Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de editar esta receta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/recetas/${id}/editar`; 
      }
    });
  };

  return (
    <div className={styles.cards}>
      <div className={styles.containerTittle}>
        <h1 className={styles.tittle}>
          <GiFruitBowl /> Vegetarianas
        </h1>
        <Link to="/crear-receta">
          <button className={styles.crearReceta} onClick={handleCreate}>
            <IoAdd /> Crear
          </button>
        </Link>
      </div>
      {recetas.map((receta) => (
        <div
          key={receta.id}
          className={`${styles.card} ${
            openId === receta.id ? styles.open : ""
          }`}
        >
          <div className={styles.cardInner}>
            {/* Parte Frontal */}
            <div className={styles.cardFront}>
              <button
                className={styles.detalle}
                onClick={() => verDetalles(receta.id)}
              >
                Detalles
              </button>
              <img
                src={receta.imagen}
                alt={`Imagen de la receta ${receta.name}`}
                className={styles.imagen}
                onError={(e) => {
                  //  e.target.src = "/images/placeholder.png"; // Mostrar una imagen de placeholder
                  console.error("Error al cargar la imagen:", e);
                }}
              />
              <h5 className={styles.tituloCard}>{receta.name}</h5>
              <p className={styles.dificultadCard}>
                Dificultad: {receta.dificultad}
              </p>
            </div>
            {/*********************** Parte de atras *********************************************************/}
            <div className={styles.cardBack}>
              <button
                className={styles.detalle}
                onClick={() => verDetalles(receta.id)}
              >
                Volver
              </button>
              <div className={styles.containerText}>
                <p className={styles.textCard}>
                  Descripción: {receta.descripcion}
                </p>
              </div>
              <p className={styles.timeCard}>Tiempo: {receta.tiempo}</p>
              <div className={styles.containerBtns}>
                <button
                  className={styles.eliminar}
                  onClick={() => handleDelete(receta.id)}
                >
                  Eliminar
                </button>
                <Link
                  to={`/recetas/${receta.id}/editar`}
                  className={styles.editar}
                  onClick={() => handleEdit(receta.id)}
                >
                  Editar
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Vegetarianas;
