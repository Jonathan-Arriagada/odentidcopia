import "./Navigation.css";
import profile from "../img/profile.png"
import Nav from "./NavIcons/Nav";
import {FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaFileMedical, FaAngleLeft} from 'react-icons/fa'
import { useState } from "react";

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
            <Nav title="Pacientes" Icon={FaUser}/>
            <Nav title="Agendas" Icon={FaCalendarAlt}/>
            <Nav title="Tarifario" Icon={FaFileInvoiceDollar}/>
            <Nav title="Tratamientos" Icon={FaFileMedical}/>
        </div>
    )
}

export default Navigation;