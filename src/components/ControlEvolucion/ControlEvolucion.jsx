import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import EditControlEvolucion from "./EditControlEvolucion";
import moment from "moment";
import { Modal } from "react-bootstrap";
import "../../style/Main.css";
import Swal from "sweetalert2";

const ControlEvolucion = () => {
    const [controles, setControles] = useState([]);
    const [search, setSearch] = useState("");
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [order, setOrder] = useState("ASC");
    const [control, setControl] = useState([]);
    const [idParam, setIdParam] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [modalShowVerDetalle, setModalShowVerDetalle] = useState(false);

    const controlesCollectiona = collection(db, "controlEvoluciones");
    const controlesCollection = useRef(query(controlesCollectiona, orderBy("fechaControlRealizado", "desc"))
    );

    const getControles = useCallback((snapshot) => {
        const controlesArray = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }));
        setControles(controlesArray);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(controlesCollection.current, getControles);
        return unsubscribe;
    }, [getControles]);

    const deleteControl = async (id) => {
        const clientDoc = doc(db, "controlEvoluciones", id);
        await deleteDoc(clientDoc);
        setControles((prevControl) =>
            prevControl.filter((control) => control.id !== id)
        );
    };

    const confirmeDelete = (id) => {
        Swal.fire({
            title: '¿Esta seguro?',
            text: "No podra revertir la accion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00C5C1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteControl(id)
                Swal.fire({
                    title: '¡Borrado!',
                    text: 'Control y evolucion borrada.',
                    icon: 'success',
                    confirmButtonColor: '#00C5C1'
                });
            }
        })
    }

    const searcher = (e) => {
        setSearch(e.target.value);
    };

    function quitarAcentos(texto) {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    let results = [];

    if (!search) {
        results = controles;
    } else {
        results = controles.filter((dato) => {
            const apellidoConNombreSinAcentos = quitarAcentos(dato.apellidoConNombre);
            const searchSinAcentos = quitarAcentos(search);
            return (
                apellidoConNombreSinAcentos.includes(searchSinAcentos) ||
                dato.idc.toString().includes(searchSinAcentos)
            );
        });
    }

    const sorting = (col) => {
        if (order === "ASC") {
            const sorted = [...controles].sort((a, b) => {
                const valueA =
                    typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
                const valueB =
                    typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
                return valueA > valueB ? 1 : -1;
            });
            setControles(sorted);
            setOrder("DSC");
        }
        if (order === "DSC") {
            const sorted = [...controles].sort((a, b) => {
                const valueA =
                    typeof a[col] === "string" ? a[col].toLowerCase() : a[col];
                const valueB =
                    typeof b[col] === "string" ? b[col].toLowerCase() : b[col];
                return valueA < valueB ? 1 : -1;
            });
            setControles(sorted);
            setOrder("ASC");
        }
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
                                <div className="d-flex justify-content-between">
                                    <h1>Control y Evoluciones</h1>
                                </div>
                                <div className="table__container">
                                    <table className="table__body">
                                        <thead>
                                            <tr>
                                                <th>N°</th>
                                                <th onClick={() => sorting("apellidoConNombre")} style={{ textAlign: "left" }}>
                                                    Apellido Y Nombres
                                                </th>
                                                <th onClick={() => sorting("idc")}>IDC</th>
                                                <th onClick={() => sorting("tratamiento")}>Tratamiento</th>
                                                <th onClick={() => sorting("pieza")}>Pieza</th>
                                                <th onClick={() => sorting("doctor")}>Doctor</th>
                                                <th onClick={() => sorting("fechaControlRealizado")}>Fecha</th>
                                                <th>Accion</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {results.map((control, index) => (
                                                <tr key={control.id}>
                                                    <td id="colIzquierda">{results.length - index}</td>
                                                    <td> {control.apellidoConNombre} </td>
                                                    <td> {control.idc} </td>
                                                    <td> {control.tratamientoControl} </td>
                                                    <td> {control.pieza} </td>
                                                    <td> {control.doctor} </td>
                                                    <td>
                                                        {moment(control.fechaControlRealizado).format(
                                                            "DD/MM/YY"
                                                        )}
                                                    </td>

                                                    <td style={{ padding: "10px" }} className="colDerecha">
                                                        <button
                                                            variant="primary"
                                                            className="btn btn-secondary mx-1"
                                                            onClick={() => {
                                                                setModalShowVerDetalle([
                                                                    true,
                                                                    control.detalleTratamiento,
                                                                ]);
                                                            }}>
                                                            <i className="fa-regular fa-comment"></i> Ver
                                                            Notas
                                                        </button>
                                                        <button
                                                            variant="primary"
                                                            className="btn btn-success mx-1"
                                                            onClick={() => {
                                                                setModalShowEditar(true);
                                                                setControl(control);
                                                                setIdParam(control.id);
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                confirmeDelete(control.id);
                                                            }}
                                                            variant="primary"
                                                            className="btn btn-danger mx-1"
                                                        >
                                                            <i className="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {modalShowVerDetalle[0] && (
                                    <Modal
                                        show={modalShowVerDetalle[0]}
                                        size="lg"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        centered
                                        onHide={() => setModalShowVerDetalle([false, ""])}
                                    >
                                        <Modal.Header
                                            closeButton
                                            onClick={() => setModalShowVerDetalle([false, ""])}
                                        >
                                            <Modal.Title>Detalle</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="container">
                                                <div className="col">
                                                    <form>
                                                        <div className="row">
                                                            <div className="col mb-6">
                                                                <p>{modalShowVerDetalle[1]}</p>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            )}

            <EditControlEvolucion
                id={idParam}
                control={control}
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
            />
        </>
    );
};

export default ControlEvolucion;