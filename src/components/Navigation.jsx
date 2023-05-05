import "./Navigation.css";
import profile from "../img/profile.png"
import Nav from "./NavIcons/Nav";
import {FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaFileMedical, FaAngleLeft, FaDoorClosed} from 'react-icons/fa'
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react";


const Navigation = () => {
    const [nav, setNav] = useState(true);
    const {currentUser} = useContext(AuthContext)
    const logout = () => {
        localStorage.setItem("user", JSON.stringify(null));
      };

    return(
        <div className={`navigation ${nav && "active"}`}>
            <div className={`menu ${nav && "active"}`} 
            onClick={() => {
                setNav((prevState) => !prevState)
            }}>
                <FaAngleLeft className="menu-icon"/>
            </div>
            <header>
                <div className="profile">
                    <img src={profile} alt="profile" className="profile-img"/>
                </div>
                <span>Odentid</span>
                <span>{currentUser.email}</span>
            </header>
            <Link to="../clients" className="text-decoration-none link-light"><Nav title="Pacientes" Icon={FaUser}/></Link>
            <Link to="../agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt}/></Link>
            <Link to="../tarifas" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar}/></Link>
            <Link to="../tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaFileMedical}/></Link>
            <Link to="/" className="text-decoration-none link-light" onClick={logout}><Nav title="Logout" Icon={FaDoorClosed}/></Link>
        </div>
    )
}

export default Navigation;