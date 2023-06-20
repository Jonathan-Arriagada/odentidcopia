import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy, } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";

const UnidadesMedidas = ({ show, onHide }) => {
    const [editIndex, setEditIndex] = useState(null);
    const [unidadMedida, setUnidadMedida] = useState("");
    const [unidadesMedidas, setUnidadesMedidas] = useState([]);
    const [error, setError] = useState("");

    const unidadesMedidasCollection = collection(db, "unidadesMedidas");
    const unidadesMedidasCollectionOrdenados = useRef(query(unidadesMedidasCollection, orderBy("name")));

    const updateUnidadesMedidasFromSnapshot = useCallback((snapshot) => {
        const unidadesMedidasArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUnidadesMedidas(unidadesMedidasArray);
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            unidadesMedidasCollectionOrdenados.current,
            updateUnidadesMedidasFromSnapshot
        );
        return unsubscribe;
    }, [updateUnidadesMedidasFromSnapshot]);

    const inputRef = useRef(null);

    const unidadMedidaExiste = (name) => {
        return unidadesMedidas.some(
            (unidadMedida) => unidadMedida.name.toLowerCase() === name.toLowerCase()
        );
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (unidadMedida.trim() === "") {
            setError("La unidad medida no puede estar vacío");
            return;
        }
        if (unidadMedidaExiste(unidadMedida)) {
            setError("La unidad medida ya existe");
            return;
        }
        const newState = { name: unidadMedida };
        addDoc(unidadesMedidasCollection, newState).then(() => {
            setUnidadMedida("");
            setError("");
        });
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setUnidadMedida(unidadesMedidas[index].name);
        setError("");
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (unidadMedida.trim() === "") {
            setError("La unidad medida no puede estar vacío");
            return;
        }
        const unidadMedidaToUpdate = unidadesMedidas[editIndex];
        const newState = { name: unidadMedida };
        setDoc(doc(unidadesMedidasCollection, unidadMedidaToUpdate.id), newState).then(() => {
            setEditIndex(null);
            setUnidadMedida("");
            setError("");
        });
    };

    const handleDelete = async (index) => {
        await deleteDoc(doc(unidadesMedidasCollection, unidadesMedidas[index].id));
        const newStates = unidadesMedidas.filter((_, i) => i !== index);
        setUnidadesMedidas(newStates);
        setUnidadMedida("");
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
                <Modal.Title>Crear/Editar/Eliminar Unidad Medida</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
                    <div className="mb-3">
                        <label className="form-label">Unidad Medida</label>
                        <input
                            type="text"
                            className="form-control"
                            value={unidadMedida}
                            onChange={(e) => setUnidadMedida(e.target.value)}
                            ref={inputRef}
                        />
                        {error && <small className="text-danger">{error}</small>}
                    </div>
                    <button className="btn button-main" type="submit">
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
                    {unidadesMedidas.map((uniMedida, index) => (
                        <div
                            key={uniMedida.id}
                            className="d-flex align-items-center justify-content-between border p-2"
                        >
                            <div>{uniMedida.name}</div>
                            <div>
                                <button
                                    className="btn button-main mx-1 btn-sm"
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

export default UnidadesMedidas;
