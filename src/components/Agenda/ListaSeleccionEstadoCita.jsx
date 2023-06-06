import React, { useState, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const ListaSeleccionEstadoCita = ({ citaId }) => {
    const [estados, setEstados] = useState([]);

    useEffect(() => {
        const fetchEstados = async () => {
            const estadosCollection = collection(db, "estados");
            const estadosSnapshot = await getDocs(estadosCollection);
            const estadosData = estadosSnapshot.docs.map((doc) => doc.data().name);
            setEstados(estadosData);
        };

        fetchEstados();
    }, []);

    const handleEstadoChange = async (selectedEstado) => {
        const citasRef = doc(db, "citas", citaId);
        await updateDoc(citasRef, { estado: selectedEstado });
    };

    return (
        <div>
            <Dropdown onSelect={handleEstadoChange}>
                <Dropdown.Toggle variant="secondary" id="dropdown-button2">
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

export default ListaSeleccionEstadoCita;