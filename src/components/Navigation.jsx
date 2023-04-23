import "./Navigation.css";
import profile from "../img/profile.png"
import Nav from "./NavIcons/Nav";
import {FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaFileMedical, FaAngleLeft} from 'react-icons/fa'
import { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
    const [nav, setNav] = useState(false);

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
            </header>
            <Link to="../clients" className="text-decoration-none link-light"><Nav title="Pacientes" Icon={FaUser}/></Link>
            <Link to="../agenda" className="text-decoration-none link-light"><Nav title="Agenda" Icon={FaCalendarAlt}/></Link>
            <Link to="../tarifario" className="text-decoration-none link-light"><Nav title="Tarifario" Icon={FaFileInvoiceDollar}/></Link>
            <Link to="../tratamientos" className="text-decoration-none link-light"><Nav title="Tratamientos" Icon={FaFileMedical}/></Link>
        </div>
    )
}

export default Navigation;