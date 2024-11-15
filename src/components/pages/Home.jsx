import React, { useEffect, useState, useRef } from "react";
import styles from "../styles/home.module.css";
import { FaChartBar } from "react-icons/fa";
import {
  Chart,
  CategoryScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  LinearScale,
} from "chart.js";

Chart.register(
  CategoryScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  DoughnutController,
  ArcElement,
  LinearScale
);

const Home = () => {
  const [chartData, setChartData] = useState({
    vegetarianas: 0,
    novegetarianas: 0,
    total: 0,
  });
  const myDoughnutChartRef = useRef(null);
  const myBarChartRef = useRef(null);
  const [showTotal, setShowTotal] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/graficos/recetas-por-tipo"
        );
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.vegetarianas && chartData.novegetarianas && chartData.total) {
      createDoughnutChart();
      createBarChart();
    }

    return () => {
      if (myDoughnutChartRef.current) {
        myDoughnutChartRef.current.destroy();
      }
      if (myBarChartRef.current) {
        myBarChartRef.current.destroy();
      }
    };
  }, [chartData]);

  useEffect(() => {
    if (myBarChartRef.current) {
      myBarChartRef.current.destroy();
      createBarChart(); // Actualiza el gráfico de barras cuando cambia el filtro
    }
  }, [showTotal]); // Vuelve a ejecutar el efecto cuando cambia el estado showTotal

  const createDoughnutChart = () => {
    const ctx = document.getElementById("myDoughnutChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Vegetarianas", "No vegetarianas"],
        datasets: [
          {
            label: "Recetas por tipo",
            data: [chartData.vegetarianas, chartData.novegetarianas],
            backgroundColor: ["#0453c9", "#f70511"],
            borderColor: ["#0453c9", "#f70511"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              // Función para calcular los porcentajes
              generateLabels: (chart) => {
                const data = chart.data.datasets[0].data;
                const total = data.reduce((a, b) => a + b, 0);
                return chart.data.labels.map((label, index) => {
                  const value = data[index];
                  const percentage = ((value / total) * 100).toFixed(0);
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: chart.data.datasets[0].backgroundColor[index],
                  };
                });
              },
            },
          },
        },
      },
    });
    myDoughnutChartRef.current = myChart;
  };

  const createBarChart = () => {
    const ctx = document.getElementById("myBarChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: showTotal ? ["Total"] : ["Vegetarianas", "No vegetarianas"],
        datasets: [
          {
            label: "Cantidad de Recetas",
            data: showTotal
              ? [chartData.total]
              : [chartData.vegetarianas, chartData.novegetarianas],
            backgroundColor: showTotal
              ? ['#0453c9'] // Color para la barra "Total"
              : ['#f70511', '#0453c9'], // Colores para "Vegetarianas" y "No vegetarianas"
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            type: "linear",
            beginAtZero: true,
          },
        },
      },
    });
    myBarChartRef.current = myChart;
  };

  const handleFilterChange = () => {
    setShowTotal(!showTotal);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}><FaChartBar className={styles.icon}/>Estadisticas</h1>
      <div className={styles.chartCardBar}>
        <h3 className={styles.tituloBar}>Cantidad de Recetas</h3>
        <button className={styles.btnFiltro}  onClick={handleFilterChange}>
          {showTotal ? "Mostrar por Tipo" : "Mostrar Total"}
        </button>
        <canvas className={styles.barras} id="myBarChart" />
      </div>
      <div className={styles.chartCardDonna}>
        <h3 className={styles.tituloDona}>Recetas por Tipo</h3>
        <canvas className={styles.donna} id="myDoughnutChart" />
      </div>

    </div>
  );
};

export default Home;
