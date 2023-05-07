import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const ListaSeleccionEstadoPago = ({ tratamientoId }) => {
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        const fetchEstados = async () => {
            const estadosCollection = collection(db, "estadoPago");
            const estadosSnapshot = await getDocs(estadosCollection);
            const estadosData = estadosSnapshot.docs.map((doc) => doc.data().name);
            setEstados(estadosData);
        };

        fetchEstados();
    }, []);

    const handleEstadoChange = async (selectedEstado) => {
        const tratamientoRef = doc(db, "tratamientos", tratamientoId);
        await updateDoc(tratamientoRef, { estadoPago: selectedEstado });
    };

    return (
        <div>
            <Dropdown onSelect={handleEstadoChange}>
                <Dropdown.Toggle variant="secondary" id="dropdown-button">
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

export default ListaSeleccionEstadoPago;