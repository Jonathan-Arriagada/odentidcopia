import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
import Navigation from "../../Navigation.jsx";
import { addDoc, collection, doc, setDoc, deleteDoc, query, orderBy, getDocs, limit } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebase.js";
import { onSnapshot } from "firebase/firestore";

const Materiales = () => {
    const [cuenta, setCuenta] = useState('');
    const [cuentaEdit, setCuentaEdit] = useState('');
    const [um, setUm] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [material, setMaterial] = useState("");
    const [materiales, setMateriales] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [modalShowGestionMateriales, setModalShowGestionMateriales] = useState(false);
    const [search, setSearch] = useState("");
    const [editable] = useState(false);


    const materialesCollection = collection(db, "materiales");
    const materialesCollectionOrdenados = useRef(query(materialesCollection, orderBy("cuenta")));

    const updateMaterialesFromSnapshot = useCallback((snapshot) => {
        const materialesArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setMateriales(materialesArray);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            materialesCollectionOrdenados.current,
            updateMaterialesFromSnapshot
        );
        return unsubscribe;
    }, [updateMaterialesFromSnapshot]);

    const inputRef = useRef(null);

    useEffect(() => {
        const getCuenta = async () => {
            const querySnapshot = await getDocs(
                query(materialesCollection, orderBy("cuenta", "desc"), limit(1))
            );
            if (!querySnapshot.empty) {
                const maxCodigo = querySnapshot.docs[0].data().cuenta;
                setCuenta(Number(maxCodigo) + 1);
            } else {
                setCuenta(1);
            }
        };
        getCuenta();
    }, [materialesCollection]);


    const materialExiste = (name) => {
        return materiales.some(
            (material) => material.name.toLowerCase() === name.toLowerCase()
        );
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (material.trim() === "" || um.trim() === "") {
            setError("El Material/U.M. no puede estar vacío");
            return;
        }
        if (materialExiste(material)) {
            setError("El Material ya existe");
            return;
        }
        const newState = { cuenta: cuenta, name: material, um: um };
        addDoc(materialesCollection, newState).then(() => {
            setError("");
        });
        handleCloseModal();
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setCuentaEdit(materiales[index].cuenta);
        setMaterial(materiales[index].name);
        setUm(materiales[index].um);
        setError("");

    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (material.trim() === "" || um.trim() === "") {
            setError("El Material/U.M. no puede estar vacío");
            return;
        }
        const materialToUpdate = materiales[editIndex];
        const newState = { cuenta: cuentaEdit, name: material, um: um };
        setDoc(doc(materialesCollection, materialToUpdate.id), newState).then(() => {
            setError("");
        });
        handleCloseModal();
    };

    const handleDelete = async (index) => {
        await deleteDoc(doc(materialesCollection, materiales[index].id));
        const newStates = materiales.filter((_, i) => i !== index);
        setMateriales(newStates);
        setMaterial("");
        setError("");
    };

    const searcher = (e) => {
        setSearch(e.target.value);
    };

    let results = [];

    if (!search) {
        results = materiales;
    } else {
        results = materiales.filter(
            (dato) =>
                dato.name.toLowerCase().includes(search.toLowerCase()) ||
                dato.cuenta.toString().includes(search.toString())
        );
    }

    const handleCloseModal = () => {
        setEditIndex(null)
        setCuenta("");
        setMaterial("");
        setUm("");
        setModalShowGestionMateriales(false);
    };

    return (
        <>
            <div className="mainpage">
                <Navigation />
                {isLoading ? (
                    <span className="loader position-absolute start-50 top-50 mt-3"></span>
                ) : (
                    <div className="container mt-2 mw-100">
                        <div className="row">
                            <div className="col">
                                <div className="d-grid gap-2">
                                    <div className="d-flex justify-content-between">
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{ maxHeight: "40px", marginLeft: "10px" }}
                                        >
                                            <h1>Materiales</h1>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <input
                                            value={search}
                                            onChange={searcher}
                                            type="text"
                                            placeholder="Buscar por Descripción o Cuenta..."
                                            className="form-control m-2 w-25"
                                        />
                                        <div className="col d-flex justify-content-end">
                                            <button
                                                variant="primary"
                                                className="btn-blue m-2"
                                                onClick={() => { setEditIndex(null); setCuentaEdit(""); setModalShowGestionMateriales(true) }}>
                                                Nuevo
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <table className="table__body">
                                    <thead>
                                        <tr>
                                            <th>Cuenta</th>
                                            <th>Descripcion</th>
                                            <th>U.M.</th>
                                            <th>Accion</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {results.map((material, index) => (
                                            <tr key={material.id}>
                                                <td>{material.cuenta}</td>
                                                <td>{material.name}</td>
                                                <td>{material.um}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary mx-1 btn-sm"
                                                        onClick={() => { setModalShowGestionMateriales(true); handleEdit(index) }}
                                                    >
                                                        <i className="fa-solid fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => { handleDelete(index) }}
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {modalShowGestionMateriales && (
                <Modal
                    show={modalShowGestionMateriales}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton onClick={handleCloseModal}>
                        <Modal.Title>Crear/Editar Materiales</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={editIndex !== null ? handleUpdate : handleCreate}>
                            <div className="mb-3">
                                <label className="form-label">Cuenta</label>
                                <input
                                    value={cuentaEdit || cuenta}
                                    disabled={!editable}
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Materiales*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                    ref={inputRef}
                                />
                                {error && <small className="text-danger">{error}</small>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">U.M.*</label>
                                <select
                                    className="form-select"
                                    value={um}
                                    onChange={(e) => setUm(e.target.value)}
                                    ref={inputRef}
                                >
                                    <option value=""></option>
                                    <option value="UND">UND</option>
                                    <option value="CAJA">CAJA</option>
                                    <option value="KITS">KITS</option>
                                    <option value="BOLSA">BOLSA</option>
                                </select>
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
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
};
export default Materiales;