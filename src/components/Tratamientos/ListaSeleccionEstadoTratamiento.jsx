import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const ListaSeleccionEstadoTratamiento = ({ tratamientoId }) => {
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        const fetchEstados = async () => {
            const estadosCollection = collection(db, "estadosTratamientos");
            const estadosSnapshot = await getDocs(estadosCollection);
            const estadosData = estadosSnapshot.docs.map((doc) => doc.data().name);
            setEstados(estadosData);
        };

        fetchEstados();
    }, []);

    const handleEstadoChange = async (selectedEstado) => {
        const tratamientoRef = doc(db, "tratamientos", tratamientoId);
        await updateDoc(tratamientoRef, { estadosTratamientos: selectedEstado });
    };

    return (
        <div>
            <Dropdown onSelect={handleEstadoChange}>
                <Dropdown.Toggle variant="info" id="dropdown-button2" className="p-2 my-1 border-0" style={{backgroundColor:"#FFF", color: "#808080"}}>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {estados.map((estado, index) => (
                        <Dropdown.Item key={index} eventKey={estado}>{estado}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default ListaSeleccionEstadoTratamiento;