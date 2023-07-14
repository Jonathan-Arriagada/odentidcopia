import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import "../../../style/Main.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from "moment";
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InformeTratamientos = () => {
  const [tablaDatos, setTablaDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");
  const [dataChart, setDataChart] = useState(null);

  const toggleView = () => {
    setShowChart(!showChart);
    setButtonText(showChart ? "Visual" : "Textual");
  };

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [{
      data: dataChart,
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
        text: 'Tratamientos por mes',
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
        min: 0,
        max: 100,
        ticks: {
          stepSize: 5,
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
    const obtenerDatos = async () => {
      const tratamientosRef = collection(db, "tratamientos");
      const unsubscribe = await onSnapshot(tratamientosRef, (querySnapshot) => {
        let datos = [];
        querySnapshot.forEach((doc) => {
          const fechaTratamiento = doc.data().fecha;
          const fecha = moment(fechaTratamiento, 'YYYY-MM-DD');
          const año = fecha.year();
          const mes = fecha.month();
          const index = datos.findIndex((data) => data.año === año);
          if (index === -1) {
            datos.push({ año, [mes]: 1 });
          } else {
            datos[index][mes] = (datos[index][mes] || 0) + 1;
          }
        });
        setTablaDatos(datos);
        const datosChart = meses.map((mes, index) => {
          const dataMes = tablaDatos.reduce((acumulador, data) => {
            const tratamientos = data[index] || 0;
            return acumulador + tratamientos;
          }, 0);
      
          return dataMes;
        });
        setDataChart(datosChart);
        setIsLoading(false);
      });

      return () => {
        unsubscribe();
      };
    };

    obtenerDatos();
  }, [tablaDatos]);

  const añosInvertidos = [...Array.from(new Set(tablaDatos.map((data) => data.año)))].reverse();
  const totalPorAnio = añosInvertidos.map((año) => {
    return meses.reduce((acumulador, mes, index) => {
      const data = tablaDatos.find((d) => d.año === año);
      const tratamientos = data ? data[index] || 0 : 0;
      return acumulador + tratamientos;
    }, 0);
  });

  return (
    <>
      {isLoading ? (
        <div className="w-100">
          <span className="loader position-absolute start-50 top-50 mt-3"></span>
        </div>
      ) : (
        <div className="container mw-100">
          <div className="row">
            <div className="col">
              <br></br>
              <div className="d-flex justify-content-between">
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ maxHeight: "40px", marginLeft: "10px" }}
                >
                  <h1>Informe Tratamientos Realizados</h1>
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

              <div className="table__container w-50">
                <table className="table__body w-50">
                  <thead>
                    <tr  className="cursor-none">
                      <th className="text-start fs-4">Meses</th>
                      {añosInvertidos.map((año) => (
                        <th className="fs-4" key={año}>{año}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="w-50">
                    {meses.map((mes, index) => (
                      <tr key={index}>
                        <td className="text-start" id="colIzquierda">{mes}</td>
                        {añosInvertidos.map((año, colIndex) => {
                          const data = tablaDatos.find((d) => d.año === año);
                          const tratamientos = data?.[index] || "-";
                          return (
                            <td className={colIndex === añosInvertidos.length - 1 ? 'colDerecha' : ''} key={año}>
                              {tratamientos}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr>
                      <td className="text-start" id="colIzquierda">Total</td>
                      {añosInvertidos.map((año, index) => (
                        <td key={index} className={index === añosInvertidos.length - 1 ? 'colDerecha' : ''}>
                          {totalPorAnio[index]}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
          )}
            </div>
          </div>
        </div>

      )}
    </>
  );
}

export default InformeTratamientos;
