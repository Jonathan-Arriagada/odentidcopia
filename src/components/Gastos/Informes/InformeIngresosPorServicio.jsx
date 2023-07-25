import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from "moment";
import "../../../style/Main.css";
import iconoDinero from "../../../img/icono-dinero.png";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const InformeIngresosPorServicio = () => {
  const añoActual = moment().year();
  const [tablaDatos, setTablaDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");
  const [añoSeleccionado, setAñoSeleccionado] = useState(añoActual);
  const [optionsAño, setOptionsAño] = useState([]);
  const [totalGeneral, setTotalGeneral] = useState(0);

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


  //TABLA LOGIC
  useEffect(() => {
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const obtenerDatos = async () => {
      const tratamientosRef = collection(db, "tratamientos");
      const unsubscribe = await onSnapshot(tratamientosRef, (querySnapshot) => {
        const datosAcumulados = {};

        querySnapshot.forEach((doc) => {
          const tratamiento = doc.data();
          const codigo = tratamiento.cta;
          const servicio = tratamiento.tarifasTratamientos;
          const cobrosManuales = tratamiento.cobrosManuales;

          if (cobrosManuales && cobrosManuales.fechaCobro) {
            cobrosManuales.fechaCobro.forEach((fechaCobro, index) => {
              const fecha = moment(fechaCobro, 'YYYY-MM-DD');
              const año = fecha.year();
              const mes = fecha.month();
              const importeAbonado = cobrosManuales.importeAbonado[index] || "";
              const importe = Number(importeAbonado) || 0;

              if (año === añoSeleccionado) {
                if (!datosAcumulados[servicio]) {
                  datosAcumulados[servicio] = {
                    codigo,
                    servicio,
                    total: 0,
                  };
                  meses.forEach((mes) => {
                    datosAcumulados[servicio][mes] = 0;
                  });
                }
                datosAcumulados[servicio][meses[mes]] += importe;
                datosAcumulados[servicio].total += importe;
              }
            });
          }
        });

        const datosFinales = Object.values(datosAcumulados);
        datosFinales.sort((a, b) => a.codigo - b.codigo);

        setTablaDatos(datosFinales);
        setIsLoading(false);

      });

      return () => { unsubscribe() };
    };
    obtenerDatos();
  }, [añoSeleccionado]);


  //GRAFICO LOCIG
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const maxIngreso = tablaDatos.length > 0
    ? Math.max(
      ...tablaDatos.map((data) => {
        const subtotal = meses.reduce((acumulador, mes) => {
          const subTotalServicio = data[mes] || 0;
          return acumulador + subTotalServicio;
        }, 0);
        return subtotal;
      })
    )
    : 0;

  const colores = [
    'rgba(0, 197, 193, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(145, 61, 136, 0.5)',
    'rgba(255, 153, 51, 0.5)',
    'rgba(231, 76, 60, 0.5)',
    'rgba(46, 204, 113, 0.5)',
    'rgba(51, 110, 123, 0.5)'
  ];

  const datosGrafico = tablaDatos.reduce((data, item) => {
    const servicio = item.servicio;
    if (!data[servicio]) {
      data[servicio] = Array(meses.length).fill(0);
    }
    meses.forEach((mes, index) => {
      data[servicio][index] += item[mes];
    });
    return data;
  }, {});
  const datasets = Object.keys(datosGrafico).map((servicio, index) => ({
    label: servicio,
    data: datosGrafico[servicio],
    backgroundColor: colores[0 % colores.length],
    barThickness: 3,
  }));
  const data = {
    labels: meses,
    datasets,
  }
  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Ingresos por servicio por mes',
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
        max: maxIngreso,
        ticks: {
          stepSize: maxIngreso / 10,
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
    let total = 0;

    tablaDatos.forEach((dato) => {
      total += Number(dato.total);
    });

    setTotalGeneral(total);
  }, [tablaDatos]);

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
                  className="d-flex justify-content-start align-items-center"
                  style={{ maxHeight: "40px", marginLeft: "10px" }}
                >
                  <h1>Informe Ingresos Por Servicio</h1>
                </div>
                <div className="col d-flex justify-content-end">
                  <div className="d-flex form-control-informeVentas">
                    <img src={iconoDinero} className="profile-dinero" alt="iconoDinero"></img>
                    <h5 id="tituloVentas">Total Ventas: <span style={{ fontWeight: 'bold' }}>{totalGeneral?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></h5>
                  </div>
                  <select
                    className="form-control-2023"
                    multiple={false}
                    onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
                    defaultValue={añoActual}
                  >
                    <option value=""></option>
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
                        <th className="text-start">Servicio</th>
                        {meses.map((mes, index) => (
                          <th className="cursor-none" key={index}>{mes}</th>
                        ))}
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tablaDatos.map((data, index) => (
                        <tr key={index}>
                          <td id="colIzquierda">{data.codigo}</td>
                          <td className="text-start">{data.servicio}</td>
                          {meses.map((mes) => (
                            <td key={mes}>
                              {data[mes] !== 0 ? data[mes]?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                            </td>
                          ))}
                          <td className={data.total < 0 ? 'danger fw-bold colDerecha' : 'colDerecha fw-bold'}>{data.total?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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