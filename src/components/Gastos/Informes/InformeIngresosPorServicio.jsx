import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from "moment";
import "../../../style/Main.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InformeIngresosPorServicio = () => {
  const [tablaDatos, setTablaDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");
  const [dataChart, setDataChart] = useState(null);
  const [añoSeleccionado, setAñoSeleccionado] = useState("2023");
  const [optionsAño, setOptionsAño] = useState([]);

  const toggleView = () => {
    setShowChart(!showChart);
    setButtonText(showChart ? "Visual" : "Textual");
  };

  const tratamientosCollectiona = collection(db, "tratamientos");
  const tratamientosCollection = useRef(query(tratamientosCollectiona));

  const getOptionsAño = useCallback((snapshot) => {
    const valoresUnicos = new Set();

    snapshot.docs.forEach((doc) => {
      const fechaTratamiento = doc.data().fecha;
      const fecha = moment(fechaTratamiento, 'YYYY-MM-DD');
      const año = fecha.year();
      valoresUnicos.add(año);
    });

    const optionsOrdenadas = Array.from(valoresUnicos).sort((a, b) => b - a);

    const options = optionsOrdenadas.map((año) => (
      <option key={`año-${año}`} value={año}>{año}</option>
    ));
    setOptionsAño(options);

  }, []);

  useEffect(() => {
    return onSnapshot(tratamientosCollection.current, getOptionsAño);
  }, [getOptionsAño]);


  //GRAFICO LOGIC
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

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  //TABLA LOGIC
  useEffect(() => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const obtenerDatos = async () => {
      const tratamientosRef = collection(db, "tratamientos");
      const unsubscribe = await onSnapshot(tratamientosRef, (querySnapshot) => {
        var datos = [];

        querySnapshot.forEach((doc) => {
          const tratamiento = doc.data();
          const codigo = tratamiento.codigo;
          const servicio = tratamiento.tarifasTratamientos;
          const cobrosManuales = tratamiento.cobrosManuales;

          if (cobrosManuales && cobrosManuales.fechaCobro) {
            const dataTratamiento = { codigo, servicio, total: 0 };

            cobrosManuales.fechaCobro.forEach((fechaCobro, index) => {
              const fecha = moment(fechaCobro, 'YYYY-MM-DD');
              const año = fecha.year();
              const mes = fecha.month();
              const importeAbonado = cobrosManuales.importeAbonado[index] || "";
              const importe = Number(importeAbonado) || 0;

              if (año === añoSeleccionado) {
                dataTratamiento[meses[mes]] = (dataTratamiento[meses[mes]] || 0) + importe;
                dataTratamiento.total += importe;
              }
            });

            datos.push(dataTratamiento);
          }
        });
        datos.sort((a, b) => a.codigo - b.codigo);

        setTablaDatos(datos);
        setIsLoading(false);
      });

      return () => {unsubscribe()};
    };
    obtenerDatos();
  }, [añoSeleccionado]);

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
                  <h1>Informe Ingresos Por Servicio</h1>
                </div>
                <div className="d-flex justify-content-end">
                  <select
                    className="form-control-doctor"
                    multiple={false}
                    onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
                    value={añoSeleccionado}
                  >
                    {optionsAño}
                  </select>
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

                <div className="table__container ">
                  <table className="table__body">
                    <thead>
                      <tr className="cursor-none">
                        <th>Codigo</th>
                        <th>Servicio</th>
                        {meses.map((mes, index) => (
                          <th className="text-start cursor-none" key={index}>{mes}</th>
                        ))}
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tablaDatos.map((data, index) => (
                        <tr key={index}>
                          <td id="colIzquierda">{data.codigo}</td>
                          <td>{data.servicio}</td>
                          {meses.map((mes, mesIndex) => (
                            <td key={mesIndex}>{data[mes] || "-"}</td>
                          ))}
                            <td className={data.total < 0 ? 'danger fw-bold colDerecha' : 'colDerecha fw-bold'}>{data.total}</td>
                        </tr>
                      ))}
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

export default InformeIngresosPorServicio;