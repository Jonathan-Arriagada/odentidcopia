import "./Navigation.css";
import profile from "../img/profile.png";
import Nav from "./zNavIcons/Nav";
import { FaUsers, FaCalendarAlt, FaFileInvoiceDollar, FaAngleLeft, FaUserTie, FaUser, FaBookMedical, FaDollarSign, FaSignOutAlt, FaStethoscope, FaShoppingCart, FaPeopleCarry, FaTruck } from 'react-icons/fa';
import { useState, useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { useEffect } from "react";

const Navigation = () => {
    const [isActive, setIsActive] = useState(false);
    const { currentUser, } = useContext(AuthContext);
    const [userType, setUserType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMouseMoving, setIsMouseMoving] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.setItem("user", JSON.stringify(null));
        navigate("/");
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
                    <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} /></Link>
                    <Link to="/clients" className="text-decoration-none link-light"><Nav title="Pacientes" Icon={FaUsers} /></Link>
                    <Link to="/tarifas" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
                    <Link to="/history" className="text-decoration-none link-light"><Nav title="Historial Clinico" Icon={FaBookMedical} /></Link>
                    <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaStethoscope} /> </Link>
                    <Link to="/ingresos" className="text-decoration-none link-light"><Nav title="Ingresos" Icon={FaDollarSign} /> </Link>
                    <Link to="/gastos" className="text-decoration-none link-light"><Nav title="Gastos" Icon={FaShoppingCart} /> </Link>
                    <Link to="/materiales" className="text-decoration-none link-light"><Nav title="Materiales" Icon={FaPeopleCarry} /> </Link>
                    <Link to="/proveedores" className="text-decoration-none link-light"><Nav title="Proveedores" Icon={FaTruck} /> </Link>

                    <Link to="/" className="text-decoration-none link-light" onClick={logout}><Nav title="Logout" Icon={FaSignOutAlt} /></Link>
                </>
            )}
        </div>
    );
};

export default Navigation;