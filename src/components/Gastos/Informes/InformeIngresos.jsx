import React, { useState, useEffect } from "react";
import "../../../style/Main.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from "moment";
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const InformeIngresos = () => {

  const [isLoading, setIsLoading] = useState(true);
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const fechaInicio = moment().subtract(7, 'days').startOf('day').format("YYYY-MM-DD");
  const fechaFin = moment().endOf('day').format("YYYY-MM-DD");
  const [periodoFechasElegido, setPeriodoFechasElegido] = useState({ fechaInicio, fechaFin });
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");

  const toggleView = () => {
    setShowChart(!showChart);
    setButtonText(showChart ? "Visual" : "Textual");
  };

  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [{
      data: [31000, 24000, 26000, 47000, 32000, 23000, 39000, 27000, 38000, 42000, 29000, 51000],
      backgroundColor: '#00c5c1',
    }]
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Ingresos por mes',
        padding: {
          top: 10,
          bottom: 30,
        },
        font: {
          weight: 'bold',
          size: 24,
          family: 'Goldplay'
        },
        color: '#FFF',
      }
    },
    scales: {
      y: {
        min: 10000,
        max: 60000,
        ticks: {
          stepSize: 5000,
          color: '#FFF',
        },
        grid: {
          borderDash: [8],
          color: '#2e3e62',
        }
      },
      x: {
        ticks: {
          color: '#FFF',
        },
        grid: {
          color: 'transparent',
        },
      },
    },
  };

  useEffect(() => {

  });


  return (
      <div className="container mw-100">
        <div className="row">
          <div className="col">
            <br></br>
            <div className="d-flex justify-content-between">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ maxHeight: "40px", marginLeft: "10px" }}
              >
                <h1>Informe Ingresos</h1>
              </div>
              <div>
                <button
                   variant="primary"
                  className="btn-blue m-1"
                  onClick={toggleView}
                >
                  {buttonText}
                </button>
              </div>
            </div>
            {showChart ? (
            <div className="pt-3 rounded-4 shadow fondo-color-primario w-75 container">
              <Bar data={data} options={options} />
            </div>
          ) : (
            <div className="table__container w-50 ">
              <table className="table__body">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>2023</th>
                    <th>2024</th>
                    <th>2025</th>
                    <th>2026</th>
                    <th>2027</th>
                    <th>2028</th>
                  </tr>
                </thead>

                <tbody>
                  {meses.map((mes, index) => (
                    <tr key={index}>
                      <td>{mes}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Total</td>
                  </tr>
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default InformeIngresos;
