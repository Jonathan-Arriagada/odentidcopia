import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from "moment";
import "../../../style/Main.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InformeIngresos = () => {
  const [tablaDatos, setTablaDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");
  const [dataChart, setDataChart] = useState(null);

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


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
    const obtenerDatos = async () => {
      const tratamientosRef = collection(db, "tratamientos");
      const unsubscribe = await onSnapshot(tratamientosRef, (querySnapshot) => {
        let datos = [];

        querySnapshot.forEach((doc) => {
          const tratamiento = doc.data();
          const cobrosManuales = tratamiento.cobrosManuales;

          if (cobrosManuales && cobrosManuales.fechaCobro) {
            cobrosManuales.fechaCobro.forEach((fechaCobro, index) => {
              const fecha = moment(fechaCobro, 'YYYY-MM-DD');
              const año = fecha.year();
              const mes = fecha.month();
              const importeAbonado = cobrosManuales.importeAbonado[index] || "";
              const importe = Number(importeAbonado) || 0;

              const existeData = datos.findIndex((data) => data.año === año);
              if (existeData === -1) {
                datos.push({ año, [mes]: importe });
              } else {
                datos[existeData][mes] = (datos[existeData][mes] || 0) + importe;
              }
            });
          }
        });
        setTablaDatos(datos);

      /* const datosChart = meses.map((mes, index) => {
         const dataMes = tablaDatos.reduce((acumulador, data) => {
           const tratamientos = data[index] || 0;
           return acumulador + tratamientos;
         }, 0);
     
         return dataMes;
       });
       setDataChart(datosChart);*/
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

              <div className="table__container w-50">
                <table className="table__body w-50">
                  <thead>
                    <tr className="cursor-none">
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
                      <td className="text-start fw-bold" id="colIzquierda">Total</td>
                      {añosInvertidos.map((año, index) => (
                        <td key={index} className={index === añosInvertidos.length - 1 ? 'colDerecha fw-bold' : 'fw-bold'}>
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

export default InformeIngresos;
