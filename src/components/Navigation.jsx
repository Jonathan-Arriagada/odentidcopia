import "./Navigation.css";
import profile from "../img/profile.png";
import Nav from "./zNavIcons/Nav";
import { FaUsers, FaCalendarAlt, FaFileInvoiceDollar, FaAngleLeft, FaUserTie, FaUser, FaBookMedical, FaDollarSign, FaSignOutAlt,FaChevronDown , FaStethoscope, FaShoppingCart, FaPeopleCarry, FaTruck, FaHeartbeat, FaLaptopMedical, FaTools, FaFax } from 'react-icons/fa';
import { useState, useContext,useCallback } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Navigation = () => {
    const [isActive, setIsActive] = useState(false);
    const { currentUser, } = useContext(AuthContext);
    const [userType, setUserType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();


    const logout = useCallback(() => {
        localStorage.setItem("user", JSON.stringify(null));
        navigate("/");
        window.location.reload();
      }, [navigate]);

    useEffect(() => {
        const type = localStorage.getItem("rol");
        setUserType(type);
        setIsLoading(true)
        if (location.pathname === "/agenda" || location.pathname === "/clients") {
            setOpen(false);
            setOpen2(false);
            setOpen3(false);
        } else {
        if (location.pathname === "/miPerfil" || location.pathname === "/admin") {
            setOpen(true);
            setOpen2(false)
            setOpen3(false)
        } 
        if (location.pathname === "/historial" || location.pathname === "/tratamientos" || location.pathname === "/controlEvoluciones") {
            setOpen3(true);
            setOpen(false)
            setOpen2(false)
        }
        if (location.pathname === "/gastos" || location.pathname === "/materiales" || location.pathname === "/proveedores"  || location.pathname === "/tarifas" || location.pathname === "/ingresos") {
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
        <div className={`navigation ${isActive && "active"}`}>
        <div className={`menu ${isActive && "active"}`} onClick={() => setIsActive(!isActive)}>
            <FaAngleLeft className="menu-icon" />
        </div>
        <header>
            <div className="profile">
                <img src={currentUser.photoURL || profile} alt="profile" className="profile-img" />
            </div>
            <span>{currentUser.displayName}</span>
        </header>
        {isLoading && (
            <>
                <Link to="/clients" className="text-decoration-none link-light"><Nav title="Pacientes" Icon={FaUsers} /></Link>
                <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} /></Link>

                <div className={open2 ? "sidebar-item open" : "sidebar-item"}>
                    <div className="sidebar-title d-flex align-items-center justify-content-between">
                        <Nav title="Gestion Financiera" Icon={FaFax} /><FaChevronDown className="toggle-btn" onClick={() => setOpen2(!open2)} />
                    </div>
                    <div className="sidebar-content">
                        <Link to="/gastos" className="text-decoration-none link-light"><Nav title="Gastos" Icon={FaShoppingCart} /> </Link>
                        <Link to="/materiales" className="text-decoration-none link-light"><Nav title="Materiales" Icon={FaPeopleCarry} /> </Link>
                        <Link to="/proveedores" className="text-decoration-none link-light"><Nav title="Proveedores" Icon={FaTruck} /> </Link>
                        <Link to="/tarifas" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
                        <Link to="/ingresos" className="text-decoration-none link-light"><Nav title="Ingresos" Icon={FaDollarSign} /> </Link>
                    </div>
                </div>
                <div className={open3 ? "sidebar-item open" : "sidebar-item"}>
                    <div className="sidebar-title d-flex align-items-center justify-content-between">
                        <Nav title="Gestion Medica" Icon={FaLaptopMedical} /><FaChevronDown className="toggle-btn" onClick={() => setOpen3(!open3)} />
                    </div>
                    <div className="sidebar-content">
                        <Link to="/historial" className="text-decoration-none link-light"><Nav title="Historial Clinico" Icon={FaBookMedical} /></Link>
                        <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaStethoscope} /></Link>
                        <Link to="/controlEvoluciones" className="text-decoration-none link-light"><Nav title="Control y Evolucion" Icon={FaHeartbeat} /></Link>

                    </div>
                </div>

                <div className="sidebar">
                    <div className={open ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Nav title="Configuraciones" Icon={FaTools} /><FaChevronDown className="toggle-btn" onClick={() => setOpen(!open)} />
                        </div>
                        <div className="sidebar-content">
                            {userType === process.env.REACT_APP_rolAdCon ? (<Link to="/admin" className="text-decoration-none link-light"><Nav title="Admin Panel" Icon={FaUserTie} /></Link>) : null}
                            <Link to="/miPerfil" className="text-decoration-none link-light"><Nav title="Mi Perfil" Icon={FaUser} /></Link>
                        </div>
                    </div>
                </div>

                <Link to="/" className="text-decoration-none link-light" onClick={logout}><Nav title="Salir" Icon={FaSignOutAlt} /></Link>

            </>
        )}
    </div>
    );
};

export default Navigation;