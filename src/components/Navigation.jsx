import "./Navigation.css";
import profile from "../img/profile.png"
import Nav from "./zNavIcons/Nav";
import { FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaFileMedical, FaAngleLeft, FaDoorClosed } from 'react-icons/fa'
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react";

const Submenu = (props) => {
    return (
        <div className="submenu">
            <Link to={`../${props.link}`} className="text-decoration-none link-light" style={{display: 'block'}}>
                <div className="submenu-option">{props.titulo}</div>
            </Link>
        </div>
    );
};

const Navigation = () => {
    const [nav, setNav] = useState(true);
    const [submenu, setSubmenu] = useState(false);
    const { currentUser } = useContext(AuthContext)

    const logout = () => {
        localStorage.setItem("user", JSON.stringify(null));
    };

    return (
        <div className={`navigation ${nav && "active"}`}>
            <div className={`menu ${nav && "active"}`}
                onClick={() => {
                    setNav((prevState) => !prevState)
                }}>
                <FaAngleLeft className="menu-icon" />
            </div>
            <header>
                <div className="profile">
                    <img src={profile} alt="profile" className="profile-img" />
                </div>
                <span>Odentid</span>
                <span>{currentUser.email}</span>
            </header>

            <Link to="../clients" className="text-decoration-none link-light" ><Nav title="Pacientes" Icon={FaUser} /></Link>
            <Link to="../agenda" className="text-decoration-none link-light" ><Nav title="Agenda" Icon={FaCalendarAlt} /></Link>
            <Link to="../tarifas" className="text-decoration-none link-light" ><Nav title="Tarifario" Icon={FaFileInvoiceDollar} /></Link>
            <Link to="../tratamientos" className="text-decoration-none link-light" onClick={() => setSubmenu(true)}><Nav title="Tratamientos" Icon={FaFileMedical} /></Link>
            {submenu && <Submenu titulo="Gestión Fechas" link="tratamientos/fechas" />}
            {submenu && <Submenu titulo="Gestión Pagos" link="tratamientos/pagos" />}

            <Link to="/" className="text-decoration-none link-light" onClick={logout}><Nav title="Logout" Icon={FaDoorClosed} /></Link>
        </div>
    )
}

export default Navigation;