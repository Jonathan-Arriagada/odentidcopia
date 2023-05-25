import "./Navigation.css";
import profile from "../img/profile.png";
import Nav from "./zNavIcons/Nav";
import { FaUsers, FaCalendarAlt, FaFileInvoiceDollar, FaAngleLeft, FaUserTie, FaUser, FaBookMedical, FaDollarSign, FaSignOutAlt, FaStethoscope, FaShoppingCart, FaPeopleCarry, FaTruck, FaChevronDown } from 'react-icons/fa';
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { useEffect } from "react";

const Navigation = () => {
    const [isActive, setIsActive] = useState(false);
    const { currentUser, } = useContext(AuthContext);
    const [userType, setUserType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [isMouseMoving, setIsMouseMoving] = useState(false);

    const logout = () => {
        localStorage.setItem("user", JSON.stringify(null));
        window.location.reload();
    };

    useEffect(() => {
        const type = localStorage.getItem("rol");
        setUserType(type);
        setIsLoading(true)
    }, []);


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
    }, [isMouseMoving]);


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
                    {userType === process.env.REACT_APP_rolAdCon ? (<Link to="/admin" className="text-decoration-none link-light"><Nav title="Admin Panel" Icon={FaUserTie} /></Link>) : null}
                    <Link to="/miPerfil" className="text-decoration-none link-light"><Nav title="Mi Perfil" Icon={FaUser} /></Link>
                    
                    <div className="sidebar">
                        <div className={open ? "sidebar-item open" : "sidebar-item"}>
                            <div className="sidebar-title d-flex align-items-center justify-content-between">
                                <Link to="/clients" className="text-decoration-none link-light"><Nav title="Pacientes" Icon={FaUsers} /></Link><FaChevronDown className="toggle-btn" onClick={() => setOpen(!open)} />
                            </div>
                            <div className="sidebar-content">

                                <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} /></Link> 
                            </div>
                        </div> 
                    </div>

                <div className={open2 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Link to="/gastos" className="text-decoration-none link-light"><Nav title="Gastos" Icon={FaShoppingCart} /> </Link><FaChevronDown className="toggle-btn" onClick={() => setOpen2(!open2)} />
                        </div>
                        <div className="sidebar-content">
                            <Link to="/materiales" className="text-decoration-none link-light"><Nav title="Materiales" Icon={FaPeopleCarry} /> </Link>
                            <Link to="/proveedores" className="text-decoration-none link-light"><Nav title="Proveedores" Icon={FaTruck} /> </Link>
                        </div>
                </div>
                <div className={open3 ? "sidebar-item open" : "sidebar-item"}>
                        <div className="sidebar-title d-flex align-items-center justify-content-between">
                            <Link to="/history" className="text-decoration-none link-light"><Nav title="Historial Clinico" Icon={FaBookMedical} /></Link><FaChevronDown className="toggle-btn" onClick={() => setOpen3(!open3)} />
                        </div>
                        <div className="sidebar-content">
                            <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaStethoscope} /></Link> 
                        </div>
                </div>
                    
                    <Link to="/tarifas" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
                    
                    <Link to="/ingresos" className="text-decoration-none link-light"><Nav title="Ingresos" Icon={FaDollarSign} /> </Link>
                </>
            )}
        </div>
    );
};

export default Navigation;