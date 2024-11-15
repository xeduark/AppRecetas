import React, { useState } from "react";
import styles from "../styles/crearReceta.module.css";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import Swal from 'sweetalert2';

const CrearReceta = () => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("vegetariana"); // Valor por defecto
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [dificultad, setDificultad] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [error, setError] = useState(null); // Declarar el estado error
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]); // Guardar el archivo de imagen
  };
  
   // Crea la instancia de Toast
   const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000, // Duración del Toast (3 segundos)
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // Función para mostrar un Toast de éxito después de crear una receta
  const showSuccessToast = () => {
    Toast.fire({
      icon: 'success',
      title: 'Receta creada exitosamente'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario

    // Validación del formulario
    if (!nombre || !descripcion || !dificultad || !tiempo || !imagen) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (imagen && !imagen.type.startsWith("image/")) {
      setError("El archivo seleccionado no es una imagen válida.");
      return;
    }

    // Obtener el token JWT de localStorage
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("name", nombre);
    formData.append("type", tipo);
    formData.append("descripcion", descripcion);
    formData.append("imagen", imagen);
    formData.append("dificultad", dificultad);
    formData.append("tiempo", tiempo);

    try {
      const response = await fetch("http://localhost:5000/api/recetas", {
        // URL de tu API
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token JWT
        },
        body: formData,
      });
      // Revisar la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        console.log("Receta creada:", data);

        // Limpiar los campos después de crear la receta
        setNombre("");
        setTipo("vegetariana"); // Volver al valor por defecto
        setDescripcion("");
        setImagen(null); // Reiniciar la imagen
        setDificultad("");
        setTiempo("");

        showSuccessToast();
  
        navigate("/vegetarianas");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: 'Error al crear la receta: ' + errorData.message,
        });
      }
    } catch (error) {
      console.log("Error creando receta:", error);
      setError("Error al crear la receta.");
      Swal.fire({
        icon: 'error',
        title: 'Error al crear',
        text: 'Error al crear la receta.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.titulo}>
        <IoIosAdd />
        Crear Receta
      </h2>
      <div className={styles.container}>
        <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={styles.input}
            />
            <label className={styles.label}>Nombre</label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="dificultad"
              value={dificultad}
              onChange={(e) => setDificultad(e.target.value)}
              required
              className={styles.input}
            />
            <label className={styles.label}>Dificultad</label>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="tiempo"
              value={tiempo}
              onChange={(e) => setTiempo(e.target.value)}
              required
              className={styles.input}
            />
            <label className={styles.label}>Tiempo</label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.labelImagen}>Imagen</label>
            <input
              type="file"
              id="imagen"
              onChange={handleImageChange}
              accept="image/*"
              required
              className={styles.selectImagen}
            />
          </div>
        </div>

        <div className={styles.columnDos}>

          <div className={styles.formGroup}>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className={styles.textTarea}
            />
            <label className={styles.labelText}>Descripción</label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.labelSelect}>Tipo</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className={styles.selectType}
            >
              <option value="vegetariana">Vegetariana</option>
              <option value="novegetariana">No Vegetariana</option>
            </select>
          </div>

          <hr className={styles.lines} />
        </div>
        <button type="submit" className={styles.submitButton}>
          Crear
        </button>
      </div>
    </form>
  );
};

export default CrearReceta;
