import React, { useState, useEffect } from "react";
import styles from "../styles/editarReceta.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import Swal from 'sweetalert2';

const EditarReceta = () => {
  const navigate = useNavigate();
  const { recetaId } = useParams(); 
  const userId = localStorage.getItem("userId");
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("vegetariana"); // Valor por defecto
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [dificultad, setDificultad] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [error, setError] = useState(null);

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

   // Función para obtener la receta a editar
   useEffect(() => {
    const fetchReceta = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(
          `http://localhost:5000/api/recetas/${recetaId}?userId=${userId}`, // Usa recetaId aquí
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setNombre(data.name);
          setTipo(data.type);
          setDescripcion(data.descripcion);
          // ... (cargar la imagen si es necesario)
          setDificultad(data.dificultad);
          setTiempo(data.tiempo);
        } else {
          const errorData = await response.json();
          setError(errorData.message);
          console.error("Error al obtener la receta:", errorData);
        }
      } catch (error) {
        console.error("Error al obtener la receta:", error);
        setError("Error al obtener la receta.");
      }
    };
    fetchReceta();
  }, [recetaId]); // Depende del ID de la receta para actualizar cuando cambia

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del formulario (similar a la de Crear Receta)
    if (!nombre || !descripcion || !dificultad || !tiempo) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Obtener el token JWT de localStorage
    const token = localStorage.getItem("authToken");

    const formData = new FormData();
    formData.append("name", nombre);
    formData.append("type", tipo);
    formData.append("descripcion", descripcion);
    if (imagen) {
      formData.append("imagen", imagen);
    }
    formData.append("dificultad", dificultad);
    formData.append("tiempo", tiempo);

    try {
      const response = await fetch(`http://localhost:5000/api/recetas/${recetaId}`, {
        // URL de tu API para editar la receta
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Receta actualizada',
          text: 'Receta actualizada exitosamente.',
        });
        navigate("/vegetarianas"); // Redirige a la página de recetas vegetarianas
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Error al actualizar la receta: ' + errorData.message,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la receta:", error);
      setError("Error al actualizar la receta.");
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Error al actualizar la receta.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.titulo}>
        <MdOutlineEdit/>
        Editar Receta
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
          Guardar
        </button>
      </div>
    </form>
  );
};

export default EditarReceta;