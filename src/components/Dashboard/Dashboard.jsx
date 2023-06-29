import React, { useCallback, useContext, useState } from 'react'
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import profile from "../../img/profile.png";
import "../../style/Main.css";
import { AuthContext } from '../../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Dropdown } from 'react-bootstrap';
import Count from './Count';
import Ausencia from './Ausencia';
import PacientesAtendidos from './PacientesAtendidos';
import CasosOrtodoncia from './CasosOrtodoncia';
import TotalTratamientos from './TotalTratamientos';
import Reviews from './Reviews';
import EficienciaFacturacion from './EficienciaFacturacion';
import IngresosYRentabilidad from './IngresosYRentabilidad';
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  //valores-fechas-Predeterminados
  const fechaInicio = moment().startOf('day').format("YYYY-MM-DD");
  const fechaFin = moment().endOf('day').format("YYYY-MM-DD");
  const [periodoFechasElegido, setPeriodoFechasElegido] = useState({ fechaInicio, fechaFin });
  //const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()
  const { currentUser, } = useContext(AuthContext);
  const logout = useCallback(() => {
    localStorage.setItem("user", JSON.stringify(null));
    navigate("/");
    window.location.reload();
  }, [navigate]);

  const confirmLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Desea cerrar sesión?',
      showDenyButton: true,
      confirmButtonText: 'Cerrar sesión',
      confirmButtonColor: '#00C5C1',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  const handleReviewsFetched = (fetchedReviews) => {
    //console.log(fetchedReviews);
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
        <nav className="navbar">
          <div className="d-flex justify-content-between px-2 w-100" >
            <div className="search-bar col-2 m-1">
              <select
                className="form-control-doctor"
                multiple={false}
                onChange={(e) => filtrosFechas(e.target.value)}
              >
                <option value="hoy">Hoy</option>
                <option value="ayer">Ayer</option>
                <option value="ultimos7">Ultimos 7 días</option>
                <option value="ultimos28">Ultimos 28 días</option>
                <option value="ultimos90">Ultimos 90 días</option>
              </select>
            </div>
            <div className="col d-flex justify-content-end align-items-center right-navbar">
              <p className="fw-normal mb-0" style={{ marginRight: "20px" }}>
                Hola, {currentUser.displayName}
              </p>
              <div className="d-flex">
                <div className="notificacion">
                  <FaBell className="icono" />
                  <span className="badge rounded-pill bg-danger">5</span>
                </div>
              </div>

              <div className="notificacion">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    className="btn btn-secondary mx-1 btn-md"
                    id="dropdown-actions"
                    style={{ background: "none", border: "none" }}
                  >
                    <img
                      src={currentUser.photoURL || profile}
                      alt="profile"
                      className="profile-picture"
                    />
                  </Dropdown.Toggle>
                  <div className="dropdown__container">
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <Link
                          to="/miPerfil"
                          className="text-decoration-none"
                          style={{ color: "#8D93AB" }}
                        >
                          <i className="icono fa-solid fa-user" style={{ marginRight: "12px" }}></i>
                          Mi Perfil
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item>

                        <Link
                          to="/"
                          className="text-decoration-none"
                          style={{ color: "#8D93AB" }}
                          onClick={confirmLogout}
                        >
                          <FaSignOutAlt className="icono" />
                          Cerrar Sesión
                        </Link>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>
        </nav>
        <div className='container mt-2 ms-4'>
          <div className="row flex-nowrap dashboard-sup">
            <div className="col-7 pt-3 me-2 rounded-4 shadow fondo-color-primario">
              <Bar data={data} options={options}></Bar>
            </div>
            <div className="col-5 ms-2 rounded-4 d-flex flex-column align-items-start shadow border-hover fuente-color-primario">
              <h2 className="fw-bold fs-5 mt-3 ms-2 ">Pacientes nuevos</h2>
              <h3 className="fs-1 ms-2 numbers"><Count /></h3>
              <h2 className="fw-bold fs-5 mt-2 ms-2">Pacientes atendidos</h2>
              <h3 className="fs-1 ms-2 numbers"><PacientesAtendidos /></h3>
              <h2 className="fw-bold fs-5 mt-2 ms-2">Nuevos casos de ortodoncia</h2>
              <h3 className="fs-1 ms-2 numbers"><CasosOrtodoncia /></h3>
            </div>
          </div>
          <div className="row mt-4 flex-nowrap dashboard-inf fuente-color-primario">
            <div className="col-3 me-1 rounded-4 d-flex align-items-start flex-column shadow border-hover">
              <h2 className="fw-bold fs-6 mt-3 ">Productividad de los dentistas</h2>
              <h3 className="fs-1 numbers">78%</h3>
              {/*N° de Tratamientos realizados por periodos por doctor*/}
              <h2 className="fw-bold fs-6">Eficiencia de facturación</h2>
              <h3 className="fs-1 numbers"><EficienciaFacturacion /></h3>
            </div>
            <div className="col-3 mx-1 rounded-4 d-flex align-items-start flex-column shadow border-hover">
              <h2 className="fw-bold fs-6 mt-3">Satisfacción del paciente</h2>
              <h3 className="fs-1 numbers"><Reviews ReviewsFetched={handleReviewsFetched} /></h3>
              <h2 className="fw-bold fs-6">Cancelación / ausencia de citas</h2>
              <h3 className="fs-1 numbers"><Ausencia /></h3>
            </div>
            <div className="col-3 mx-1 rounded-4 d-flex align-items-start flex-column shadow border-hover">
              <h2 className="fw-bold fs-6 mt-3">Ingresos y Rentabilidad</h2>
              <h3 className="fs-1 numbers"><IngresosYRentabilidad /></h3>

              <h2 className="fw-bold fs-6">Ingresos por tratamiento</h2>
              <h3 className="fs-1 numbers"><TotalTratamientos /></h3>
            </div>
            <div className="col-3 ms-1 rounded-4 d-flex align-items-start flex-column shadow border-hover">
              <h2 className="fw-bold fs-6 mt-3">Retención de pacientes</h2>
              <h3 className="fs-1 numbers">76%</h3>
              {/*Cantidad de pacientes existente que regresan los pacientes por periodo*/}
            </div>
          </div>
        </div>
      </div>

  );
};

export default Dashboard