import React, { useState, useEffect, useCallback, useRef } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase";
import "../../../style/Main.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from "moment";
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparacionMensual = () => {
  const [tablaDatos, setTablaDatos] = useState([]);
  const [tablaDatos2, setTablaDatos2] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChart, setShowChart] = useState(false);
  const [buttonText, setButtonText] = useState("Visual");
  const [año1, setAño1] = useState("");
  const [año2, setAño2] = useState("");
  const [mesElegido1, setMesElegido1] = useState("");
  const [mesElegido2, setMesElegido2] = useState("");
  const [optionsAño, setOptionsAño] = useState([]);
  const [optionsAño2, setOptionsAño2] = useState([]);

  const gastosCollectiona = collection(db, "gastos");
  const gastosCollection = useRef(query(gastosCollectiona));

  const getOptionsAño = useCallback((snapshot) => {
    const valoresUnicos = new Set();

    snapshot.docs.forEach((doc) => {
      const fechaGasto = doc.data().fechaGasto;
      const fecha = moment(fechaGasto, 'YYYY-MM-DD');
      const año = fecha.year();
      valoresUnicos.add(año);
    });

    const optionsOrdenadas = Array.from(valoresUnicos).sort((a, b) => b - a);

    const options = optionsOrdenadas.map((año) => (
      <option key={`año-${año}`} value={año}>{año}</option>
    ));
    setOptionsAño(options);
    setOptionsAño2(options);

  }, []);

  useEffect(() => {
    return onSnapshot(gastosCollection.current, getOptionsAño);
  }, [getOptionsAño]);

  const toggleView = () => {
    setShowChart(!showChart);
    setButtonText(showChart ? "Visual" : "Textual");
  };


  //TABLAS LOGIC
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  useEffect(() => {
    const obtenerDatos = async () => {

      const gastosRef = collection(db, "gastos");
      const unsubscribe = await onSnapshot(gastosRef, (querySnapshot) => {
        let datos = [];
        let datos2 = [];

        querySnapshot.forEach((doc) => {
          const cuenta = doc.data().cuentaArticulo;
          const descripcion = doc.data().descripArticulo;
          const cant = doc.data().cantArticulo;
          const um = doc.data().umArticulo;
          const fechaGastos = doc.data().fechaGasto;
          const fecha = moment(fechaGastos, 'YYYY-MM-DD');
          const mes = fecha.month();
          const año = fecha.year();
          const subTotalArticulo = doc.data().subTotalArticulo;

          if (año === año1 && mes === mesElegido1) {
            const index = datos.findIndex((data) => data.descripcion === descripcion);
            if (index === -1) {
              datos.push({ cuenta, descripcion, cant, um, importe: subTotalArticulo });
            } else {
              datos[index].importe = (datos[index].importe || 0) + subTotalArticulo;
            }
          }

          if (año === año2 && mes === mesElegido2) {
            const index = datos2.findIndex((data) => data.descripcion === descripcion);
            if (index === -1) {
              datos2.push({ cuenta, descripcion, cant, um, importe: subTotalArticulo });
            } else {
              datos2[index].importe = (datos2[index].importe || 0) + subTotalArticulo;
            }
          }
        });

        setTablaDatos(datos);
        setTablaDatos2(datos2);
        setIsLoading(false);
      });

      return () => {
        unsubscribe();
      };
    };

    obtenerDatos();
  }, [año1, mesElegido1, año2, mesElegido2]);


  //GRAFICO LOGIC
  const maxValues = [...tablaDatos, ...tablaDatos2].map(data => {
    const subtotal = meses.reduce((acumulador, mes) => {
      const subTotalArticulo = (data && data[mes]) || 0;
      return acumulador + subTotalArticulo;
    }, 0);
    return subtotal;
  });

  const maxValue = Math.max(...maxValues);
  const steps = parseFloat((maxValue / 10).toFixed(0))

  const colores = ['rgba(0, 197, 193, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'];

  const data = {
    labels: meses,
    datasets: [
      {
        label: año1.toString(),
        data: meses.map((mes) => {
          const data = tablaDatos.find((d) => d.año === año1);
          return data ? data[mes] || 0 : 0;
        }),
        backgroundColor: colores[0 % colores.length],
      },
      {
        label: año2.toString(),
        data: meses.map((mes) => {
          const data = tablaDatos2.find((d) => d.año === año2);
          return data ? data[mes] || 0 : 0;
        }),
        backgroundColor: colores[1 % colores.length],
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
        max: maxValue,
        ticks: {
          stepSize: steps,
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
        <>
          <div className="container mw-100">
            <div className="col">
              <br></br>
              <div className="d-flex justify-content-between">
                <div
                  style={{ maxHeight: "40px", marginLeft: "10px" }}
                >
                  <h1>Reporte Comparación Compras Mensual</h1>
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
                <>
                  <div className="d-flex mt-3 align-items-center justify-content-evenly">
                    <div className="table__container m-2 w-50">
                      <div className="d-flex">
                        <select
                          className="form-control-doctor"
                          multiple={false}
                          onChange={(e) => setMesElegido1(Number(e.target.value))}
                          value={mesElegido1}
                        >
                          <option value=""></option>
                          {meses.map((mes, index) => (
                            <option key={index} value={index}>{mes}</option>
                          ))}
                        </select>
                        <select
                          className="form-control-doctor"
                          multiple={false}
                          onChange={(e) => setAño1(Number(e.target.value))}
                          value={año1}
                        >
                          <option value=""></option>
                          {optionsAño}
                        </select>
                      </div>
                      <table className="table__body rounded">
                        <thead>
                          <tr className="cursor-none">
                            <th>Cuenta</th>
                            <th className="text-start">Descripcion</th>
                            <th>Cant</th>
                            <th>U.M.</th>
                            <th>Importe</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tablaDatos.map((data, index) => (
                            <tr key={index}>
                              <td>{data.cuenta}</td>
                              <td>{data.descripcion}</td>
                              <td>{data.cant}</td>
                              <td>{data.um}</td>
                              <td>{data.importe?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="table__container m-2 w-50">
                      <div className="d-flex">
                        <select
                          className="form-control-doctor"
                          multiple={false}
                          onChange={(e) => setMesElegido2(Number(e.target.value))}
                          value={mesElegido2}
                        >
                          <option value=""></option>
                          {meses.map((mes, index) => (
                            <option key={index} value={index}>{mes}</option>
                          ))}
                        </select>
                        <select
                          className="form-control-doctor"
                          multiple={false}
                          onChange={(e) => setAño2(Number(e.target.value))}
                          value={año2}
                        >
                          <option value=""></option>
                          {optionsAño2}
                        </select>

                      </div>
                      
                      <table className="table__body rounded">
                        <thead>
                          <tr className="cursor-none">
                            <th>Cuenta</th>
                            <th className="text-start">Descripcion</th>
                            <th>Cant</th>
                            <th>U.M.</th>
                            <th>Importe</th>
                          </tr>
                        </thead>

                        <tbody>
                          {tablaDatos2.map((data, index) => (
                            <tr key={index}>
                              <td>{data.cuenta}</td>
                              <td>{data.descripcion}</td>
                              <td>{data.cant}</td>
                              <td>{data.um}</td>
                              <td>{data.importe?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ComparacionMensual;
