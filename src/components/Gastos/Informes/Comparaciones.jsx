import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import "../../../style/Main.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from "moment";
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Comparaciones = () => {
  const [tablaDatos, setTablaDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");

  const toggleView = () => {
    setShowChart(!showChart);
    setButtonText(showChart ? "Visual" : "Textual");
  };

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const añosInvertidos = [...Array.from(new Set(tablaDatos.map((data) => data.año)))].reverse();

  useEffect(() => {
    const obtenerDatos = async () => {
      const gastosRef = collection(db, "gastos");
      const unsubscribe = await onSnapshot(gastosRef, (querySnapshot) => {
        let datos = [];
        querySnapshot.forEach((doc) => {
          const fechaGastos = doc.data().fechaGasto;
          const fecha = moment(fechaGastos, 'YYYY-MM-DD');
          const año = fecha.year();
          const mes = fecha.month();
          const subTotalArticulo = doc.data().subTotalArticulo;
          const index = datos.findIndex((data) => data.año === año);
          if (index === -1) {
            datos.push({ año, [meses[mes]]: subTotalArticulo });
          } else {
            datos[index][meses[mes]] = (datos[index][meses[mes]] || 0) + subTotalArticulo;
          }
        });
        setTablaDatos(datos);
        setIsLoading(false);
      });

      return () => {
        unsubscribe();
      };
    };

    obtenerDatos();
  }, []);

  const totalPorAnio = añosInvertidos.map((año) => {
    return meses.reduce((acumulador, mes) => {
      const data = tablaDatos.find((d) => d.año === año);
      const subTotalArticulo = data ? data[mes] || 0 : 0;
      return acumulador + subTotalArticulo;
    }, 0);
  });

  const colores = ['rgba(0, 197, 193, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'];

  const data = {
    labels: meses,
    datasets: añosInvertidos.map((año,index) => {
      return {
        label: año.toString(),
        data: meses.map((mes) => {
          const data = tablaDatos.find((d) => d.año === año);
          return data ? data[mes] || 0 : 0;
        }),
        backgroundColor: colores[index % colores.length],
      };
    }),
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Gastos por mes',
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
        max: 20000,
        ticks: {
          stepSize: 2000,
          color: '#FFF',
        },
        grid: {
          borderDash: [8],
          color: '#2e3e62',
        }
      },
      x: {
        stacked: true,
        ticks: {
          color: '#FFF',
        },
        grid: {
          color: 'transparent',
        },
      },
    },
  };

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
                  <h1>Informe Gastos Realizados</h1>
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
                          const gastos = data ? data[mes] || "-" : "-";
                          return (
                            <td className={colIndex === añosInvertidos.length - 1 ? 'colDerecha' : ''} key={año}>
                              {gastos}
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

export default Comparaciones;
