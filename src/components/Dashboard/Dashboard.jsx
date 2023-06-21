import React, { useCallback, useContext, useState } from 'react'
import Navigation from '../Navigation'
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell, FaBold } from "react-icons/fa";
import profile from "../../img/profile.png";
import "../../style/Main.css";
import { AuthContext } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Dropdown } from 'react-bootstrap';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



function Dashboard() {
   
const [search, setSearch] = useState("");
const [isLoading, setIsLoading] = useState(true);
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

  const searcher = (e) => {
    setSearch(e.target.value);
  };

  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [{
      data: [9, 14, 20, 12, 32, 15, 39, 27, 11, 18, 25, 22],
      backgroundColor: '#47abff',
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
        min: 5,
        max: 60,
        ticks: {
          stepSize: 10,
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
    <div className="mainpage">
      <Navigation />
      <div className="w-100">
        <nav className="navbar">
          <div className="d-flex justify-content-between px-2 w-100" >
            <div className="search-bar">
              <input
                value={search}
                onChange={searcher}
                type="text"
                placeholder="Buscar por Apellido y Nombres o IDC..."
                className="form-control-upNav  m-2"
              />
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
        <div className='container mt-2'>
          <div className="row m-2 flex-nowrap" style={{width: "70vw"}}>
            <div className="col-7 pb-3 me-2 rounded-4 shadow fondo-color-primario" style={{ height: '40vh' }}>
              <Bar data={data} options={options}></Bar>
            </div>
            <div className="col-5 ms-2 rounded-4 d-flex justify-content-center align-items-start flex-column shadow" style={{ height: '40vh' }}>
              <h2 className="fw-bold fs-6">Productividad de los dentistas</h2>
              <h3 className="fs-1">78%</h3>
              <h2 className="fw-bold fs-6">Eficiencia en el proceso de facturacion</h2>
              <h3 className="fs-1">48%</h3>
            </div>
          </div>
          <div className="row m-2 mt-4 flex-nowrap " style={{width: "70vw"}}>
          <div className="col-3 me-1 rounded-4 d-flex justify-content-center align-items-start flex-column shadow" style={{ height: '40vh' }}>
            <h2 className="fw-bold fs-6">Pacientes nuevos</h2>
            <h3 className="fs-1">4</h3>
            <h2 className="fw-bold fs-6">Pacientes atendidos</h2>
            <h3 className="fs-1">21</h3>
            <h2 className="fw-bold fs-6">Nuevos casos de ortodoncia</h2>
            <h3 className="fs-1">3</h3>
          </div>
          <div className="col-3 mx-1 rounded-4 d-flex justify-content-center align-items-start flex-column shadow" style={{ height: '40vh' }}>
            <h2 className="fw-bold fs-6">Índice de satisfacción del paciente</h2>
            <h3 className="fs-1">4.2</h3>
            <h2 className="fw-bold fs-6">Índice de cancelación y ausencia de citas</h2>
            <h3 className="fs-1">34%</h3>
          </div>
          <div className="col-3 mx-1 rounded-4 d-flex justify-content-center align-items-start flex-column shadow" style={{ height: '40vh' }}>
            <h2 className="fw-bold fs-6">Ingresos y Rentabilidad</h2>
            <h3 className="fs-1">4</h3>
            <h2 className="fw-bold fs-6">Ingresos por tratamiento</h2>
            <h3 className="fs-1">7</h3>
          </div>
          <div className="col-3 ms-1 rounded-4 d-flex justify-content-center align-items-start flex-column shadow" style={{ height: '40vh' }}>
            <h2 className="fw-bold fs-6">Tasa de retención de pacientes</h2>
            <h3 className="fs-1">78%</h3>
          </div>

          </div>
        </div>
     </div>
    
</div>
  );
};

export default Dashboard