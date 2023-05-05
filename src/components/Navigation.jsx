import "./Navigation.css";
import profile from "../img/profile.png";
import Nav from "./zNavIcons/Nav";
import { FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaFileMedical, FaAngleLeft, FaDoorClosed } from 'react-icons/fa';
import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

const Submenu = (props) => {
    return (
        <div className="submenu-container">
            <div className="submenu-option">{props.titulo}</div>
        </div>
    );
};

const Navigation = () => {
    const [isActive, setIsActive] = useState(false);
    const [isActiveSubMenu, setIsActiveSubMenu] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const location = useLocation();

    //Desde acá se eligen las variables de los submenú
    const submenuVariables = ["/tratamientos", "/tratamientos/fechas", "/tratamientos/pagos"];

    useEffect(() => {
        setIsActiveSubMenu(false);
    }, [location]);

    const logout = () => {
        localStorage.setItem("user", JSON.stringify(null));
    };

    return (
        <div className={`navigation ${isActive && "active"}`}>
            <div className={`menu ${isActive && "active"}`} onClick={() => setIsActive(!isActive)}>
                <FaAngleLeft className="menu-icon" />
            </div>
            <header>
                <div className="profile">
                    <img src={profile} alt="profile" className="profile-img" />
                </div>
                <span>Odentid</span>
                <span>{currentUser.email}</span>
            </header>

            <Link to="/clients" className="text-decoration-none link-light"><Nav title="Pacientes" Icon={FaUser} /></Link>
            <Link to="/agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt} /></Link>
            <Link to="/tarifas" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
            <Link to="/tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaFileMedical} /> </Link>

            <div className={`submenu-link ${isActiveSubMenu && "active"}`} onClick={() => setIsActiveSubMenu(!isActiveSubMenu)}>
                {(submenuVariables.includes(location.pathname)) && (
                    <>
                        <Link to={submenuVariables[1]} className="text-decoration-none link-light">
                            <Submenu titulo="Gestión Fechas" />
                        </Link>
                        <Link to={submenuVariables[2]} className="text-decoration-none link-light">
                            <Submenu titulo="Gestión Pagos" />
                        </Link>
                    </>
                )}
            </div>

            <Link to="/" className="text-decoration-none link-light" onClick={logout}><Nav title="Logout" Icon={FaDoorClosed} /></Link>
        </div>
    );
};

export default Navigation;