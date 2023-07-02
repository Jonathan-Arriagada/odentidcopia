import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal } from "react-bootstrap";
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
    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState([]);

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

    const updateOptionsUnidadMedida = useCallback(snapshot => {
        const unidadMedidaOptions = snapshot.docs.map((doc, index) => (
            <option key={`unidadMedida-${index}`} value={doc.data().name}>{doc.data().name}</option>
        ));
        setUnidadMedidaOptions(unidadMedidaOptions);
    }, []);


    useEffect(() => {
        const unsubscribe = [
            onSnapshot(materialesCollectionOrdenados.current, updateMaterialesFromSnapshot),
            onSnapshot(query(collection(db, "unidadesMedidas"), orderBy("name")), updateOptionsUnidadMedida),
        ];
        return () => unsubscribe.forEach(fn => fn());
    }, [updateMaterialesFromSnapshot, updateOptionsUnidadMedida]);

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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    function quitarAcentos(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    let filteredResults = [];

    if (!search) {
        filteredResults = materiales;
    } else {
        filteredResults = materiales.filter((dato) => {
            const nameSinAcentos = quitarAcentos(dato.name);
            const searchSinAcentos = quitarAcentos(search);
            return (
                nameSinAcentos.includes(searchSinAcentos) ||
                dato.cuenta.toString().includes(searchSinAcentos)
            );
        });
    }

    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

    const handleCloseModal = () => {
        setEditIndex(null)
        setCuenta("");
        setMaterial("");
        setUm("");
        setModalShowGestionMateriales(false);
    };

    return (
        <>
            {isLoading ? (
                <div className="w-100">
                    <span className="loader position-absolute start-50 top-50 mt-3"></span>
                </div>
            ) : (
                <div className="w-100">
                    <div className="search-bar d-flex col-2 m-2 ms-3 w-50">
                        <input
                            value={search}
                            onChange={searcher}
                            type="text"
                            placeholder="Buscar..."
                            className="form-control-upNav  m-2"
                        />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>

                    <div className="container mw-100">
                        <div className="row">
                            <div className="col">
                                <br></br>
                                <div className="d-grid gap-2">
                                    <div className="d-flex justify-content-between">
                                        <div
                                            className="d-flex justify-content-center align-items-center"
                                            style={{ maxHeight: "40px", marginLeft: "10px" }}
                                        >
                                            <h1 className="me-2">Materiales</h1>
                                        </div>
                                        <div className="col d-flex justify-content-start">
                                            <button
                                                variant="primary"
                                                className="btn-blue m-2"
                                                onClick={() => { setEditIndex(null); setCuentaEdit(""); setModalShowGestionMateriales(true) }}>
                                                Nuevo
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="table__container">
                                    <table className="table__body">
                                        <thead>
                                            <tr>
                                                <th>Cuenta</th>
                                                <th style={{ textAlign: "left" }}>Descripcion</th>
                                                <th>U.M.</th>
                                                <th>Accion</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {currentResults.map((material, index) => (
                                                <tr key={material.id}>
                                                    <td id="colIzquierda">{material.cuenta}</td>
                                                    <td style={{ textAlign: "left" }}>{material.name}</td>
                                                    <td>{material.um}</td>
                                                    <td className="colDerecha">
                                                        <button
                                                            className="btn btn-success mx-1 btn-sm"
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
                                <div className="table__footer">
                                    <div className="table__footer-left">
                                        Mostrando {startIndex + 1} - {Math.min(endIndex, materiales.length)} de {materiales.length}
                                    </div>

                                    <div className="table__footer-right">
                                        <span>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                style={{ border: "0", background: "none" }}
                                            >
                                                &lt; Previo
                                            </button>
                                        </span>

                                        {[...Array(totalPages)].map((_, index) => {
                                            const page = index + 1;
                                            return (
                                                <span key={page}>
                                                    <span
                                                        onClick={() => handlePageChange(page)}
                                                        className={page === currentPage ? "active" : ""}
                                                        style={{
                                                            margin: "2px",
                                                            backgroundColor: page === currentPage ? "#003057" : "transparent",
                                                            color: page === currentPage ? "#FFFFFF" : "#000000",
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        {page}
                                                    </span>
                                                </span>
                                            );
                                        })}

                                        <span>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                style={{ border: "0", background: "none" }}
                                            >
                                                Siguiente &gt;
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    onChange={(e) => {
                                        var inputValue = e.target.value.toUpperCase();
                                        setMaterial(inputValue)
                                    }}
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
                                    {unidadMedidaOptions}
                                </select>
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
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
};
export default Materiales;
