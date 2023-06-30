import Nav from "./zNavIcons/Nav";
import { FaUsers, FaMoon, FaCalendarAlt, FaFileInvoiceDollar, FaMoneyCheckAlt, FaNotesMedical, FaPoll, FaAngleLeft, FaUserTie, FaUser, FaBookMedical, FaDollarSign, FaSignOutAlt, FaStethoscope, FaShoppingCart, FaPeopleCarry, FaTruck, FaHeartbeat, FaLaptopMedical, FaTools, FaFax, FaChartBar, FaFileAlt, FaBox, FaArchive, FaDonate, FaBalanceScale, FaChartLine } from 'react-icons/fa';
import { useState, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../img/logo-odentid2.png"
import icono from "../img/icono.png"
import "../style/Main.css";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";


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

    const handleClick = (stateSetter, currentState) => {
        setOpen(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
        setOpen5(false);
        setOpen6(false);
        setOpen7(false);
        stateSetter(!currentState);
    };
    const handleClick2 = (stateSetter, currentState) => {
        setOpen(false);
        setOpen3(false);
        setOpen4(false);
        setOpen5(false);
        setOpen6(false);
        setOpen7(false);
        stateSetter(!currentState);
    }


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
                        <Link to="/dashboard" className="text-decoration-none link-light"><Nav title="Dashboard" Icon={FaChartBar} isActive={isActive} /></Link>
                        <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} isActive={isActive} /></Link>
                    </div>
                    <div className={open ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title link-light" onClick={() => handleClick(setOpen, open)}>
                            <Nav title="Pacientes" Icon={FaLaptopMedical} isActive={isActive} />
                        </div>
                        <div className="sidebar-content">
                            <Link to="/pacientes" className="text-decoration-none link-light"><Nav title="Listado Pacientes" Icon={FaUsers} isActive={isActive} /></Link>
                            <Link to="/historias" className="text-decoration-none link-light"><Nav title="Historias" Icon={FaBookMedical} isActive={isActive} /></Link>
                            <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaStethoscope} isActive={isActive} /></Link>
                            <Link to="/controlEvoluciones" className="text-decoration-none link-light"><Nav title="Control y Evolucion" Icon={FaHeartbeat} isActive={isActive} /></Link>
                        </div>
                    </div>
                    <div className={open2 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title link-light" onClick={() => handleClick(setOpen2, open2)}>
                            <Nav title="Contabilidad" Icon={FaFax} isActive={isActive} />
                        </div>
                        <div className="sidebar-content">
                            <div className="sidebar-title">
                                <Link to="/tarifario" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} isActive={isActive} /></Link>
                            </div>
                            <div className={open4 ? "sidebar-item open" : "sidebar-item"} >
                                <div className="sidebar-title link-light" onClick={() => handleClick2(setOpen4, open4)} >
                                    <Nav title="Registros contables" Icon={FaFax} isActive={isActive} />
                                </div>
                                <div className="sidebar-content sub-content">
                                    <Link to="/ventas" className="text-decoration-none link-light"><Nav title="Ventas" Icon={FaDollarSign} isActive={isActive} /> </Link>
                                    <Link to="/compras" className="text-decoration-none link-light"><Nav title="Compras" Icon={FaShoppingCart} isActive={isActive} /> </Link>
                                </div>
                            </div>
                            <div className={open5 ? "sidebar-item open" : "sidebar-item"}>
                                <div className="sidebar-title link-light" onClick={() => handleClick2(setOpen5, open5)}>
                                    <Nav title="Informes contables" Icon={FaFileAlt} isActive={isActive} />
                                </div>
                                <div className="sidebar-content sub-content">
                                    <Link to="/informe-ingresos" className="text-decoration-none link-light"><Nav title="Informe ingresos" Icon={FaDonate} isActive={isActive} /> </Link>
                                    <Link to="/informe-ingresos-tratamiento" className="text-decoration-none link-light"><Nav title="Informe Tratamientos" Icon={FaNotesMedical} isActive={isActive} /></Link>
                                    <Link to="/informe-compras" className="text-decoration-none link-light"><Nav title="Informe Compras" Icon={FaMoneyCheckAlt} isActive={isActive} /> </Link>
                                    <Link to="/comparacion-compras" className="text-decoration-none link-light"><Nav title="Comparaciones" Icon={FaBalanceScale} isActive={isActive} /> </Link>
                                </div>
                            </div>
                            <div className={open7 ? "sidebar-item open" : "sidebar-item"}>
                                <div className="sidebar-title link-light" onClick={() => handleClick2(setOpen7, open7)}>
                                    <Nav title="Estados Financieros" Icon={FaChartLine} isActive={isActive} />
                                </div>
                                <div className="sidebar-content sub-content">
                                    <Link to="/estado-resultados" className="text-decoration-none link-light"><Nav title="Estado de resultados" Icon={FaPoll} isActive={isActive} /> </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={open3 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title link-light" onClick={() => handleClick(setOpen3, open3)} >
                            <Nav title="Inventarios" Icon={FaArchive} isActive={isActive} />
                        </div>
                        <div className="sidebar-content">
                            <Nav title="Inventario" Icon={FaBox} isActive={isActive} />
                            <Link to="/materiales" className="text-decoration-none link-light"><Nav title="Materiales" Icon={FaPeopleCarry} isActive={isActive} /> </Link>
                            <Link to="/proveedores" className="text-decoration-none link-light"><Nav title="Proveedores" Icon={FaTruck} isActive={isActive} /> </Link>
                        </div>
                    </div>

                    <div className="sidebar">
                        <div className={open6 ? "sidebar-item open" : "sidebar-item"}>
                            <div className="sidebar-title link-light" onClick={() => handleClick(setOpen6, open6)}>
                                <Nav title="Configuracion" Icon={FaTools} isActive={isActive} />
                            </div>
                            <div className="sidebar-content">
                                {userType === process.env.REACT_APP_rolAdCon ? (<Link to="/admin" className="text-decoration-none link-light"><Nav title="Usuarios" Icon={FaUserTie} isActive={isActive} /></Link>) : null}
                                <Link to="/miPerfil" className="text-decoration-none link-light"><Nav title="Mi Perfil" Icon={FaUser} isActive={isActive} /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="sidebar-title">
                        <Link className="text-decoration-none link-light" onClick={toggleDarkMode}><Nav title="Modo Nocturno" Icon={FaMoon} isActive={isActive} /></Link>
                        <Link to="/" className="text-decoration-none link-light" onClick={confirmLogout}><Nav title="Salir" Icon={FaSignOutAlt} isActive={isActive} /></Link>
                    </div>

                </>
            )}
        </div>
    );
};

const NavigationWrapper = () => {
    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return <Navigation />;
    }

};

export default NavigationWrapper;