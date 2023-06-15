
import Nav from "./zNavIcons/Nav";
import { FaUsers, FaCalendarAlt, FaFileInvoiceDollar, FaAngleLeft, FaUserTie, FaUser, FaBookMedical, FaDollarSign, FaSignOutAlt,FaChevronDown , FaStethoscope, FaShoppingCart, FaPeopleCarry, FaTruck, FaHeartbeat, FaLaptopMedical, FaTools, FaFax, FaChartBar, FaFileAlt, FaBox, FaArchive } from 'react-icons/fa';
import { useState, useCallback } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../img/icono.png"
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
    const [isMouseMoving, setIsMouseMoving] = useState(false);
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
        if (location.pathname === "/miPerfil" || location.pathname === "/admin") {
            setOpen(true);
            setOpen2(false)
            setOpen3(false)
        } 
        if (location.pathname === "/historia" || location.pathname === "/tratamientos" || location.pathname === "/controlEvoluciones") {
            setOpen3(true);
            setOpen(false)
            setOpen2(false)
        }
        if (location.pathname === "/gastos" || location.pathname === "/materiales" || location.pathname === "/proveedores"  || location.pathname === "/tarifario" || location.pathname === "/ingresos") {
            setOpen2(true);
            setOpen(false)
            setOpen3(false)
        }
    }
    }, [location.pathname]);

    useEffect(() => {
        const tiempoInactivoMax = 15 * 60 * 1000; // 15 minuto
        let inactivityTimeout;

        const resetInactivityTimeout = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                if (!isMouseMoving) {
                    logout();
                }
            }, tiempoInactivoMax);
        };

        const handleMouseMove = () => {
            setIsMouseMoving(true);
            resetInactivityTimeout();
        };

        document.addEventListener("mousemove", handleMouseMove);
        resetInactivityTimeout();

        return () => {
            clearTimeout(inactivityTimeout);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isMouseMoving,logout]);


    return (
        <div className={`navigation ${isActive && "active"}`} style={{ fontFamily: 'Goldplay' }}>
        <div className={`menu ${isActive && "active"}`} onClick={() => setIsActive(!isActive)}>
            <FaAngleLeft className="menu-icon" />
        </div>
        <header>
            <div className="profile">
                <img src={logo} alt="profile" className="profile-img" />
            </div>
        </header>
        {isLoading && (
            <>
           <Link to="/dashboard" className="text-decoration-none link-light"><Nav title="Dashboard" Icon={FaChartBar} /></Link>
            <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} /></Link>
                <div className={open ? "sidebar-item open" : "sidebar-item"}>
                    <div className="sidebar-title d-flex align-items-center justify-content-between">
                        <Nav title="Pacientes" Icon={FaLaptopMedical} /><FaChevronDown className="toggle-btn" onClick={() => setOpen(!open)} />
                    </div>
                    <div className="sidebar-content">
                        <Link to="/pacientes" className="text-decoration-none link-light"><Nav title="Lista de Pacientes" Icon={FaUsers} /></Link>
                        <Link to="/historia" className="text-decoration-none link-light"><Nav title="Historial Clínica" Icon={FaBookMedical} /></Link>
                        <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaStethoscope} /></Link>
                        <Link to="/controlEvoluciones" className="text-decoration-none link-light"><Nav title="Control y Evolucion" Icon={FaHeartbeat} /></Link>

                    </div>
                </div>
                <div className={open2 ? "sidebar-item open" : "sidebar-item"}>
                    <div className="sidebar-title d-flex align-items-center justify-content-between">
                        <Nav title="Finanzas" Icon={FaFax} /><FaChevronDown className="toggle-btn" onClick={() => setOpen2(!open2)} />
                    </div>
                    <div className="sidebar-content">
                        <Link to="/ingresos" className="text-decoration-none link-light"><Nav title="Ingresos" Icon={FaDollarSign} /> </Link>
                        <Link to="/gastos" className="text-decoration-none link-light"><Nav title="Gastos" Icon={FaShoppingCart} /> </Link>
                        <Link to="/tarifario" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
                        <Nav title="Informes financieros" Icon={FaFileAlt} />  
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
                    <div className={open4 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Nav title="Configuracion" Icon={FaTools} /><FaChevronDown className="toggle-btn" onClick={() => setOpen4(!open4)} />
                        </div>
                        <div className="sidebar-content">
                            {userType === process.env.REACT_APP_rolAdCon ? (<Link to="/admin" className="text-decoration-none link-light"><Nav title="Usuarios" Icon={FaUserTie} /></Link>) : null}
                            <Link to="/miPerfil" className="text-decoration-none link-light"><Nav title="Mi Perfil" Icon={FaUser} /></Link>
                        </div>
                    </div>
                </div>

                <Link to="/" className="text-decoration-none link-light" onClick={confirmLogout}><Nav title="Salir" Icon={FaSignOutAlt} /></Link>

            </>
        )}
    </div>
    );
};

export default Navigation;