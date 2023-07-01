import React, { useCallback, useContext } from 'react'
import Swal from 'sweetalert2';
import { AuthContext } from "../context/AuthContext";
import { Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import profile from "../img/profile.png";

const Upnav = () => {
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

    return (
        <nav className="navbar w-100 position-absolute">
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
                                <div className="dropdown-item">
                                    <Link
                                        to="/miPerfil"
                                        className="text-decoration-none"
                                        style={{ color: "#8D93AB" }}
                                    >
                                        <i className="icono fa-solid fa-user" style={{ marginRight: "12px" }}></i>
                                        Mi Perfil
                                    </Link>
                                </div>
                                <div className="dropdown-item">
                                    <Link
                                        to="/"
                                        className="text-decoration-none"
                                        style={{ color: "#8D93AB" }}
                                        onClick={confirmLogout}
                                    >
                                        <FaSignOutAlt className="icono" />
                                        Cerrar Sesión
                                    </Link>
                                </div>

                            </Dropdown.Menu>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
};


export default Upnav;