import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, onSnapshot, query, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import moment from "moment";
import "../../../style/Main.css";
ChartJS.register(CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend);

const Resultados = () => {
  const añoActual = moment().year();
  const [tablaDatos, setTablaDatos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");
  const [añoSeleccionado, setAñoSeleccionado] = useState(añoActual);
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

  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  //TABLA LOGIC
  useEffect(() => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const obtenerDatos = async () => {
      const tratamientosRef = collection(db, "tratamientos");
      const gastosRef = collection(db, "gastos");

      const [tratamientosSnapshot, gastosSnapshot] = await Promise.all([
        getDocs(tratamientosRef),
        getDocs(gastosRef),
      ]);

      var datos = {
        descripcion: "Ingresos",
        total: 0,
      };
      var datos2 = {
        descripcion: "Gastos",
        total: 0,
      };
      var datos3 = {
        descripcion: "Resultados",
        total: 0,
      };

      tratamientosSnapshot.forEach((doc) => {
        const tratamiento = doc.data();
        const cobrosManuales = tratamiento.cobrosManuales;

        if (cobrosManuales && cobrosManuales.fechaCobro) {
          cobrosManuales.fechaCobro.forEach((fechaCobro, index) => {
            const fecha = moment(fechaCobro, 'YYYY-MM-DD');
            const año = fecha.year();
            const mes = fecha.month();
            const importeAbonado = cobrosManuales.importeAbonado[index] || "";
            const importe = Number(importeAbonado) || 0;

            if (año === añoSeleccionado) {
              datos[meses[mes]] = (datos[meses[mes]] || 0) + importe;
              datos.total += importe;
            }
          });
        }
      });

      gastosSnapshot.forEach((doc) => {
        const gasto = doc.data();
        const fechaGasto = gasto.fechaGasto;
        const fecha = moment(fechaGasto, 'YYYY-MM-DD');
        const año = fecha.year();
        const mes = fecha.month();
        const importe = gasto.subTotalArticulo || 0;

        if (año === añoSeleccionado) {
          datos2[meses[mes]] = (datos2[meses[mes]] || 0) + importe;
          datos2.total += importe;
        }
      });

      for (const mes of meses) {
        const ingresoMes = datos[mes] || 0;
        const gastoMes = datos2[mes] || 0;
        datos3[mes] = ingresoMes - gastoMes;
        datos3.total += datos3[mes];
      }

      setTablaDatos([datos, datos2, datos3]);
      setIsLoading(false);
    };

    obtenerDatos();
  }, [añoSeleccionado]);


  const data1Values = tablaDatos.length > 0 ? Object.values(tablaDatos[2]).slice(2) : [];

  const minValue = Math.min(...data1Values);
  const maxValue = Math.max(...data1Values);


  const data = {
    labels: meses,
    datasets: [
      {
        label: `Resultados ${añoSeleccionado}`,
        data: tablaDatos.length > 0 ? Object.values(tablaDatos[2]).slice(2) : [],
        borderColor: '#00c5c1',
        fill: false,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: 'Resultados por mes',
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
        min: minValue >= 0 ? 0 : minValue - 1000,
        max: maxValue >= 0 ? maxValue + 1000 : 0,
        ticks: {
          stepSize: maxValue / 10,
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
                  <h1>Reporte de Resultados</h1>
                </div>
                <div className="d-flex justify-content-end">
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
                  <Line data={data} options={options} />
                </div>
              ) : (
                <>
                  <br></br>
                  <div className="table__container ">
                    <div className="d-flex justify-content-between">
                      <h1 className="fs-4 mx-2" style={{ textAlign: "left" }}>Estado de resultados {añoSeleccionado}</h1>
                      <div className=" justify-content-end m-1">
                        <select
                          className="form-control-doctor"
                          multiple={false}
                          onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
                          defaultValue={añoActual}
                        >
                          <option value=""></option>
                          {optionsAño}
                        </select>
                      </div>
                    </div>
                    <table className="table__body">
                      <thead>
                        <tr className="cursor-none">
                          <th>Descripcion</th>
                          {meses.map((mes, index) => (
                            <th className="cursor-none" key={index}>{mes}</th>
                          ))}
                          <th>Total</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tablaDatos.map((data, index) => (
                          <tr key={index} id={index === 2 ? 'backgroundGray' : ''}>
                            <td id="colIzquierda">{data.descripcion}</td>
                            {meses.map((mes, mesIndex) => (
                              <td key={mesIndex} className={data[mes] < 0 ? 'danger fw-bold' : ''}>
                                {data[mes]?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "-"}</td>
                            ))}
                            <td className={data.total < 0 ? 'danger fw-bold colDerecha' : 'colDerecha fw-bold'}>{data.total?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Resultados;