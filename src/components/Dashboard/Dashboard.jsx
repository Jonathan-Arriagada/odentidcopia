import React, { useState } from 'react'
import "../../style/Main.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PacientesNuevos from './PacientesNuevos';
import Ausencia from './Ausencia';
import PacientesAtendidos from './PacientesAtendidos';
import CasosOrtodoncia from './CasosOrtodoncia';
import TotalTratamientos from './TotalTratamientos';
import GoogleReviews from './GoogleReviews';
import EficienciaFacturacion from './EficienciaFacturacion';
import IngresosYRentabilidad from './IngresosYRentabilidad';
import moment from "moment";
import ProductividadDentistas from './ProductividadDentistas';
import Top3Tratamientos from './Top3Tratamientos';
import CitasPorConfirmar from './CitasPorConfirmar';
import Rating from 'react-rating-stars-component';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  //valores-fechas-Predeterminados
  const fechaInicio = moment().subtract(7, 'days').startOf('day').format("YYYY-MM-DD");
  const fechaFin = moment().endOf('day').format("YYYY-MM-DD");
  const [periodoFechasElegido, setPeriodoFechasElegido] = useState({ fechaInicio, fechaFin });
  //const [isLoading, setIsLoading] = useState(true);

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

  const filtrosFechas = (param) => {
    let fechaInicio, fechaFin;

    switch (param) {
      case "hoy":
        fechaInicio = moment().startOf('day').format("YYYY-MM-DD");
        fechaFin = moment().endOf('day').format("YYYY-MM-DD");
        break;
      case "ayer":
        fechaInicio = moment().subtract(1, 'day').startOf('day').format("YYYY-MM-DD");
        fechaFin = moment().subtract(1, 'day').endOf('day').format("YYYY-MM-DD");
        break;
      case "ultimos7":
        fechaInicio = moment().subtract(7, 'days').startOf('day').format("YYYY-MM-DD");
        fechaFin = moment().endOf('day').format("YYYY-MM-DD");
        break;
      case "ultimos28":
        fechaInicio = moment().subtract(28, 'days').startOf('day').format("YYYY-MM-DD");
        fechaFin = moment().endOf('day').format("YYYY-MM-DD");
        break;
      case "ultimos90":
        fechaInicio = moment().subtract(90, 'days').startOf('day').format("YYYY-MM-DD");
        fechaFin = moment().endOf('day').format("YYYY-MM-DD");
        break;
      default:
        fechaInicio = "";
        fechaFin = "";
        break;
    }

    setPeriodoFechasElegido({ fechaInicio, fechaFin });
  };

  return (
    <div className="w-100">
      <div className="search-bar d-flex col-2 m-2 ms-3">
        <select
          className="form-control-doctor"
          multiple={false}
          onChange={(e) => filtrosFechas(e.target.value)}
          defaultValue="ultimos7"
        >
          <option value="hoy">Hoy</option>
          <option value="ayer">Ayer</option>
          <option value="ultimos7">Ultimos 7 días</option>
          <option value="ultimos28">Ultimos 28 días</option>
          <option value="ultimos90">Ultimos 90 días</option>
        </select>
      </div>

      <div className="container mw-100 ms-4">
        <div className="row flex-nowrap dashboard-sup">
          <div className="col-6 pt-3 me-2 rounded-4 shadow fondo-color-primario">
            <Bar data={data} options={options}></Bar>
          </div>
          <div className="col-3 ms-2 rounded-4 d-flex flex-column align-items-start justify-content-center shadow border-hover fuente-color-primario dashContenedor">
            <div className='d-flex align-items-center'>
              <i className="fa-solid fa-users iconosDash"></i>
              <div>
                <h2 className="fw-bold fs-6 mt-1 ms-2">Pacientes atendidos</h2>
                <h3 className="fs-2 ms-4 text-start"><PacientesAtendidos fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} /></h3>
              </div>
            </div>


            <div className='d-flex align-items-center'>
              <i className="fa-solid fa-user-plus iconosDash"></i>
              <div>
                <h2 className="fw-bold fs-6 mt-2 ms-2 ">Pacientes nuevos</h2>
                <h3 className="fs-2 ms-4 text-start"><PacientesNuevos fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} /></h3>
              </div>
            </div>

            <div className='d-flex align-items-center'>
              <i className="fa-solid fa-hospital-user iconosDash"></i>
              <div>
                <h2 className="fw-bold fs-6 mt-1 ms-2">Casos Ortodoncia</h2>
                <h3 className="fs-2 ms-4 text-start"><CasosOrtodoncia fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} /></h3>
              </div>
            </div>
          </div>
          
          <div className="dashEspecial col-3 ms-2 rounded-4 d-flex align-items-start flex-column shadow border-hover fuente-color-primario dashContenedor">
            <h2 className="fw-bold fs-5 mt-3 ">Productividad Doctores</h2>
            <ProductividadDentistas fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
          </div>
        </div>
        <div className="row mt-4 flex-nowrap dashboard-inf fuente-color-primario">
          <GoogleReviews>
            {({ cantOpinionesTotal, porcenOpinionesTotal, dataReady }) => (
              <div className="col-3 rounded-4 mx-1 d-flex align-items-center justify-content-center flex-column shadow border-hover dashContenedor">
                <h1 className="fw-bold" style={{ fontSize: "8vh" }}>{porcenOpinionesTotal.toFixed(1)}</h1>
                <div className="d-flex align-items-center justify-content-center">
                  <img
                    className='iconosDashGoogle m-1'
                    src='https://cdn-icons-png.flaticon.com/512/300/300221.png'
                    alt="googleImg">
                  </img>
                  {dataReady ? (
                    <Rating
                      count={5}
                      size={20}
                      value={Math.floor(porcenOpinionesTotal * 2) / 2}
                      edit={false}
                      isHalf={true}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fas fa-star-half-alt"></i>}
                      filledIcon={<i className="fas fa-star"></i>}
                    />
                  ) : null}
                </div>
                <p className="fs-5 fw-bold">{cantOpinionesTotal} reseñas</p>

              </div>
            )}
          </GoogleReviews>

          <div className="col-3 mx-1 rounded-4 d-flex flex-column shadow border-hover dashContenedor">
            <div className='d-flex mt-3 align-items-center justify-content-between'>
              <h2 className="fw-bold fs-6">Top Tratamientos</h2>
              <i className="fa-solid fa-tooth mx-2 fs-4"></i>
            </div>
            <div className="numbers align-items-center" style={{ fontSize: "0.9rem" }}>
              <Top3Tratamientos fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
            </div>

            <div className='d-flex align-items-center justify-content-between'>
              <h2 className="fw-bold fs-6">Eficiencia Facturación</h2>
              <i className="fa-solid fa-hand-holding-dollar mb-1 mx-2 fs-4"></i>
            </div>
            <h3 className="fs-2 text-start">
              <EficienciaFacturacion fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
            </h3>
          </div>


          <div className="col-3 mx-1 rounded-4 d-flex flex-column shadow border-hover dashContenedor">
            <div className='d-flex align-items-center justify-content-between mt-3'>
              <h2 className="fw-bold fs-6">Ingresos y Rentabilidad</h2>
              <i className="fa-solid fa-chart-line mx-2 fs-4"></i>
            </div>
            <h3 className="fs-2 text-start">
              <IngresosYRentabilidad fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
            </h3>

            <div className='d-flex align-items-center justify-content-between mt-4'>
              <h2 className="fw-bold fs-6 mt-2">Ingresos Tratamientos</h2>
              <i className="fa-solid fa-file-invoice-dollar mx-2 fs-4"></i>
            </div>
            <h3 className="fs-2 text-start">
              <TotalTratamientos fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
            </h3>
          </div>


          <div className="col-3 mx-1 rounded-4 d-flex flex-column shadow border-hover dashContenedor">
            <div className='d-flex align-items-center justify-content-between mt-3'>
              <h2 className="fw-bold fs-6">Citas Por Confirmar</h2>
              <i className="fa-solid fa-calendar-days mx-2 fs-4"></i>
            </div>
            <h3 className="fs-2 text-start">
              <CitasPorConfirmar fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
            </h3>

            <div className='d-flex align-items-center justify-content-between mt-4'>
              <h2 className="fw-bold fs-7 mt-2">Cancelación/Ausencias</h2>
              <i className="fa-solid fa-calendar-xmark mx-2 fs-4"></i>
            </div>
            <h3 className="fs-2 text-start">
              <Ausencia fechaInicio={periodoFechasElegido.fechaInicio} fechaFin={periodoFechasElegido.fechaFin} />
            </h3>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Dashboard