import Nav from "./zNavIcons/Nav";
import { FaUsers, FaMoon, FaCalendarAlt, FaFileInvoiceDollar, FaMoneyCheckAlt, FaNotesMedical, FaPoll, FaAngleLeft, FaUserTie, FaUser, FaBookMedical, FaDollarSign, FaSignOutAlt, FaChevronDown, FaStethoscope, FaShoppingCart, FaPeopleCarry, FaTruck, FaHeartbeat, FaLaptopMedical, FaTools, FaFax, FaChartBar, FaFileAlt, FaBox, FaArchive, FaDonate, FaBalanceScale, FaChartLine } from 'react-icons/fa';
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../img/logo-odentid2.png"
import icono from "../img/icono.png"
import "../style/Main.css";
import Swal from "sweetalert2";

const Navigation = () => {
    const [isActive, setIsActive] = useState(false);
    const [userType, setUserType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);
    const [open7, setOpen7] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
        const type = localStorage.getItem("rol");
        setUserType(type);
        setIsLoading(true)
        if (location.pathname === "/agenda" || location.pathname === "/pacientes") {
            setOpen(false);
            setOpen2(false);
            setOpen3(false);
        } else {
            if (location.pathname === "/pacientes" || location.pathname === "/historias" || location.pathname === "/tratamientos" || location.pathname === "/controlEvoluciones") {
                setOpen(true);
                setOpen2(false)
                setOpen3(false)
                setOpen4(false)
                setOpen5(false)
                setOpen6(false)
            }
            if (location.pathname === "/tarifario") {
                setOpen2(true);
                setOpen(false)
                setOpen3(false)
                setOpen4(false)
                setOpen5(false)
                setOpen6(false)
            }
            if (location.pathname === "/compras" || location.pathname === "/ventas") {
                setOpen4(true);
                setOpen(false)
                setOpen2(true)
                setOpen3(false)
                setOpen5(false)
                setOpen6(false)
            }
            if (location.pathname === "/informe-ingresos" || location.pathname === "/informe-ingresos-tratamiento" || location.pathname === "/informe-compras" || location.pathname === "/comparacion-compras") {
                setOpen5(true);
                setOpen(false)
                setOpen2(true)
                setOpen3(false)
                setOpen4(false)
                setOpen6(false)
            }
            if (location.pathname === "/miPerfil" || location.pathname === "/admin") {
                setOpen6(true);
                setOpen(false)
                setOpen2(false)
                setOpen3(false)
                setOpen4(false)
                setOpen5(false)
            }
            if (location.pathname === "estado-resultados") {
                setOpen7(true);
                setOpen(false)
                setOpen2(true)
                setOpen3(false)
                setOpen4(false)
                setOpen5(false)
                setOpen6(false)
            }
        }
    }, [location.pathname]);


    function toggleDarkMode() {
        const html = document.querySelector('html');
        html.classList.toggle('modo-nocturno');
    }

    return (
        <div className={`navigation ${isActive && "active"}`} style={{ fontFamily: 'Goldplay' }}>
            <div className={`menu ${isActive && "active"}`} onClick={() => setIsActive(!isActive)}>
                <FaAngleLeft className="menu-icon" />
            </div>
            <header>
                <div className="profile">
                    <img src={isActive ? icono : logo} alt="profile" className={isActive ? "profile-img-inactive" : "profile-img"} />
                </div>
            </header>
            {isLoading && (
                <>
                    <div className="sidebar-title">
                        <Link to="/dashboard" className="text-decoration-none link-light"><Nav title="Dashboard" Icon={FaChartBar} /></Link>
                        <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} /></Link>
                    </div>
                    <div className={open ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Nav title="Pacientes" Icon={FaLaptopMedical} /><FaChevronDown className="toggle-btn" onClick={() => setOpen(!open)} />
                        </div>
                        <div className="sidebar-content">
                            <Link to="/pacientes" className="text-decoration-none link-light"><Nav title="Listado Pacientes" Icon={FaUsers} /></Link>
                            <Link to="/historias" className="text-decoration-none link-light"><Nav title="Historias" Icon={FaBookMedical} /></Link>
                            <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaStethoscope} /></Link>
                            <Link to="/controlEvoluciones" className="text-decoration-none link-light"><Nav title="Control y Evolucion" Icon={FaHeartbeat} /></Link>
                        </div>
                    </div>
                    <div className={open2 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Nav title="Contabilidad" Icon={FaFax} /><FaChevronDown className="toggle-btn" onClick={() => setOpen2(!open2)} />
                        </div>
                        <div className="sidebar-content">
                            <div className="sidebar-title d-flex align-items-center justify-content-between">
                                <Link to="/tarifario" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
                            </div>
                            <div className={open4 ? "sidebar-item open" : "sidebar-item"}>
                                <div className="sidebar-title d-flex align-items-center justify-content-between">
                                    <Nav title="Registros contables" Icon={FaFax} /><FaChevronDown className="toggle-btn" onClick={() => setOpen4(!open4)} />
                                </div>
                                <div className="sidebar-content sub-content">
                                    <Link to="/ventas" className="text-decoration-none link-light"><Nav title="Ventas" Icon={FaDollarSign} /> </Link>
                                    <Link to="/compras" className="text-decoration-none link-light"><Nav title="Compras" Icon={FaShoppingCart} /> </Link>
                                </div>
                            </div>
                            <div className={open5 ? "sidebar-item open" : "sidebar-item"}>
                                <div className="sidebar-title d-flex align-items-center justify-content-between">
                                    <Nav title="Informes contables" Icon={FaFileAlt} /> <FaChevronDown className="toggle-btn" onClick={() => setOpen5(!open5)} />
                                </div>
                                <div className="sidebar-content sub-content">
                                    <Link to="/informe-ingresos" className="text-decoration-none link-light"><Nav title="Informe ingresos" Icon={FaDonate} /> </Link>
                                    <Link to="/informe-ingresos-tratamiento" className="text-decoration-none link-light"><Nav title="Informe Tratamientos" Icon={FaNotesMedical} /> </Link>
                                    <Link to="/informe-compras" className="text-decoration-none link-light"><Nav title="Informe Compras" Icon={FaMoneyCheckAlt} /> </Link>
                                    <Link to="/comparacion-compras" className="text-decoration-none link-light"><Nav title="Comparaciones" Icon={FaBalanceScale} /> </Link>
                                </div>
                            </div>
                            <div className={open7 ? "sidebar-item open" : "sidebar-item"}>
                                <div className="sidebar-title d-flex align-items-center justify-content-between">
                                    <Nav title="Estados Financieros" Icon={FaChartLine} /> <FaChevronDown className="toggle-btn" onClick={() => setOpen7(!open7)} />
                                </div>
                                <div className="sidebar-content sub-content">
                                    <Link to="/estado-resultados" className="text-decoration-none link-light"><Nav title="Estado de resultados" Icon={FaPoll} /> </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={open3 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Nav title="Inventarios" Icon={FaArchive} /><FaChevronDown className="toggle-btn" onClick={() => setOpen3(!open3)} />
                        </div>
                        <div className="sidebar-content">
                            <Nav title="Inventario" Icon={FaBox} />
                            <Link to="/materiales" className="text-decoration-none link-light"><Nav title="Materiales" Icon={FaPeopleCarry} /> </Link>
                            <Link to="/proveedores" className="text-decoration-none link-light"><Nav title="Proveedores" Icon={FaTruck} /> </Link>
                        </div>
                    </div>

                    <div className="sidebar">
                        <div className={open6 ? "sidebar-item open" : "sidebar-item"}>
                            <div className="sidebar-title d-flex align-items-center justify-content-between">
                                <Nav title="Configuracion" Icon={FaTools} /><FaChevronDown className="toggle-btn" onClick={() => setOpen6(!open6)} />
                            </div>
                            <div className="sidebar-content">
                                {userType === process.env.REACT_APP_rolAdCon ? (<Link to="/admin" className="text-decoration-none link-light"><Nav title="Usuarios" Icon={FaUserTie} /></Link>) : null}
                                <Link to="/miPerfil" className="text-decoration-none link-light"><Nav title="Mi Perfil" Icon={FaUser} /></Link>
                            </div>
                        </div>
                    </div>
                    <Link className="text-decoration-none link-light" onClick={toggleDarkMode}><Nav title="Modo Nocturno" Icon={FaMoon} /></Link>
                    <Link to="/" className="text-decoration-none link-light" onClick={confirmLogout}><Nav title="Salir" Icon={FaSignOutAlt} /></Link>

                </>
            )}
        </div>
    );
};

export default Navigation;