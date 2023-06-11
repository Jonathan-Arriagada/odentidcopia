import React, { useCallback, useContext, useState } from 'react'
import Navigation from '../Navigation'
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import profile from "../../img/profile.png";
import "../../style/Main.css";
import { AuthContext } from '../../context/AuthContext';

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
                className="form-control m-2"
              />
            </div>
            <div className="col d-flex justify-content-end align-items-center right-navbar">
              <p className="fw-bold mb-0" style={{ marginRight: "20px" }}>
                Bienvenido {currentUser.displayName}
              </p>
              <div className="d-flex">
                <div className="notificacion">
                  <Link
                    to="/miPerfil"
                    className="text-decoration-none"
                  >
                    <img src={currentUser.photoURL || profile} alt="profile" className="profile-picture" />
                  </Link>
                </div>
                <div className="notificacion">
                  <FaBell className="icono" />
                  <span className="badge rounded-pill bg-danger">5</span>
                </div>
              </div>
              <div className="notificacion">
                <Link
                  to="/"
                  className="text-decoration-none"
                  style={{ color: "#8D93AB" }}
                  onClick={confirmLogout}
                >
                  <FaSignOutAlt className="icono" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        </div >

  </div>
  );
};

export default Dashboard