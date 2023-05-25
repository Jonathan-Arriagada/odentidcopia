import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy, } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";

const TipoGasto = ({ show, onHide }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [tipoGasto, setTipoGasto] = useState("");
    const [tipoGastos, setTipoGastos] = useState([]);
    const [error, setError] = useState("");

    const tipoGastosCollection = collection(db, "tipoGasto");
    const tipoGastosCollectionOrdenados = useRef(query(tipoGastosCollection, orderBy("name")));

    const updateTipoGastoFromSnapshot = useCallback((snapshot) => {
        const tipoGastosArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setTipoGastos(tipoGastosArray);
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            tipoGastosCollectionOrdenados.current,
            updateTipoGastoFromSnapshot
        );
        return unsubscribe;
    }, [updateTipoGastoFromSnapshot]);

    const inputRef = useRef(null);

    const tipoGastoExiste = (name) => {
        return tipoGastos.some(
            (tipoGasto) => tipoGasto.name.toLowerCase() === name.toLowerCase()
        );
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (tipoGasto.trim() === "") {
            setError("El Tipo Gasto no puede estar vacío");
            return;
        }
        if (tipoGastoExiste(tipoGasto)) {
            setError("El Tipo Gasto ya existe");
            return;
        }
        const newState = { name: tipoGasto };
        addDoc(tipoGastosCollection, newState).then(() => {
            setTipoGasto("");
            setError("");
        });
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setTipoGasto(tipoGastos[index].name);
        setError("");
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (tipoGasto.trim() === "") {
            setError("El Tipo Gasto no puede estar vacío");
            return;
        }
        const tipoGastoToUpdate = tipoGastos[editIndex];
        const newState = { name: tipoGasto };
        setDoc(doc(tipoGastosCollection, tipoGastoToUpdate.id), newState).then(() => {
            setEditIndex(null);
            setTipoGasto("");
            setError("");
        });
    };

    const handleDelete = async (index) => {
        await deleteDoc(doc(tipoGastosCollection, tipoGastos[index].id));
        const newStates = tipoGastos.filter((_, i) => i !== index);
        setTipoGastos(newStates);
        setTipoGasto("");
        setError("");
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Crear/Editar/Eliminar Tipo Gasto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
                    <div className="mb-3">
                        <label className="form-label">Tipo Gasto</label>
                        <input
                            type="text"
                            className="form-control"
                            value={tipoGasto}
                            onChange={(e) => setTipoGasto(e.target.value)}
                            ref={inputRef}
                        />
                        {error && <small className="text-danger">{error}</small>}
                    </div>
                    <button className="btn btn-primary" type="submit">
                        {editIndex !== null ? "Actualizar" : "Crear"}
                    </button>

                    {editIndex !== null && (
                        <button
                            className="btn btn-secondary mx-2"
                            onClick={() => setEditIndex(null)}
                        >
                            Cancelar
                        </button>
                    )}
                </form>
                <div className="mt-3">
                    {tipoGastos.map((tipo, index) => (
                        <div
                            key={tipo.id}
                            className="d-flex align-items-center justify-content-between border p-2"
                        >
                            <div>{tipo.name}</div>
                            <div>
                                <button
                                    className="btn btn-primary mx-1 btn-sm"
                                    onClick={() => handleEdit(index)}
                                >
                                    <i className="fa-solid fa-edit"></i>
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(index)}
                                >
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default TipoGasto;
