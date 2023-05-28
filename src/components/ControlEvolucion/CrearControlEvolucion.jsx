import React, { useState, useCallback, useEffect } from "react";
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const Create = (props) => {
    const [apellidoConNombre, setApellidoConNombre] = useState('');
    const [idc, setIdc] = useState('');
    const [tratamientoControl, setTratamientoControl] = useState('');
    const [pieza, setPieza] = useState('');
    const [doctor, setDoctor] = useState('');
    const [fechaControlRealizado, setFechaControlRealizado] = useState('');
    const [detalleTratamiento, setDetalleTratamiento] = useState('');
    const [idPaciente, setIdPaciente] = useState('');
    const [editable,] = useState('');
    const [optionsPacientes, setOptionsPacientes] = useState([]);
    const [optionsTratamientos, setOptionsTratamientos] = useState([]);

    const [error, setError] = useState("");

    const controlesCollection = collection(db, "controlEvoluciones");

    const updateOptionsPacientes = useCallback(snapshot => {
        const options = snapshot.docs.map(doc => (
            <option key={`valorBusqueda-${doc.id}`} value={doc.valorBusqueda}>{doc.data().valorBusqueda}</option>
        ));
        setOptionsPacientes(options);
    }, []);

    const updateOptionsTratamientos = useCallback(snapshot => {
        const options2 = snapshot.docs.map(doc => (
            <option key={`tarifasTratamientos-${doc.id}`} value={doc.tarifasTratamientos}>{doc.data().tarifasTratamientos}</option>
        ));
        setOptionsTratamientos(options2);
    }, []);


    useEffect(() => {
        const unsubscribe = [
            onSnapshot(query(collection(db, "clients"), orderBy("valorBusqueda")), updateOptionsPacientes),
            onSnapshot(query(collection(db, "tratamientos"), orderBy("tarifasTratamientos")), updateOptionsTratamientos),
        ];
        return () => unsubscribe.forEach(fn => fn());
    }, [updateOptionsPacientes, updateOptionsTratamientos]);

    const validateFields = async (e) => {
        e.preventDefault();
        if (
            apellidoConNombre.trim() === "" ||
            idc.trim() === "" ||
            fechaControlRealizado.trim() === "" ||
            tratamientoControl.trim() === ""
        ) {
            setError("Todos los campos son obligatorios");
            setTimeout(clearError, 2000)
            return false;
        } else {
            setError("");
            await store();
            clearFields();
            props.onHide();
        }
        return true;
    };

    const clearError = () => {
        setError("");
    };

    const clearFields = () => {
        setApellidoConNombre("");
        setIdc("");
        setIdPaciente("");
        setTratamientoControl("");
        setPieza("");
        setFechaControlRealizado("");
        setDoctor("");
        setDetalleTratamiento("");
        setError("");
    };

    const manejarValorSeleccionado = async (suggestion) => {
        const querySnapshot = await getDocs(
            query(collection(db, "clients"), where("valorBusqueda", "==", suggestion))
        );

        const doc = querySnapshot.docs[0];

        if (doc) {
            const data = doc.data();
            setApellidoConNombre(data.apellidoConNombre);
            setIdc(data.idc);
            setIdPaciente(doc.id)
        }
    };

    const store = async () => {
        await addDoc(controlesCollection, {
            apellidoConNombre: apellidoConNombre,
            idc: idc,
            idPaciente: idPaciente,
            fechaControlRealizado: fechaControlRealizado,
            tratamientoControl: tratamientoControl,
            pieza: pieza,
            doctor: doctor,
            detalleTratamiento: detalleTratamiento,
        });
    };


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton onClick={() => { clearFields(); props.onHide(); }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h1>Crear Control Y Evolucion</h1>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="container">
                    <div className="col sm-6 " style={{ background: "#23C9FF", padding: "6px", borderRadius: "20px", width: "60%" }}>
                        <label className="form-label" style={{ marginLeft: "15px", fontWeight: "bold", fontSize: "14px" }}>Buscador por Apellido, Nombre o DNI:</label>
                        <input
                            style={{ borderRadius: "150px" }}
                            type="text"
                            className="form-control"
                            onChangeCapture={(e) => manejarValorSeleccionado(e.target.value)}
                            list="pacientes-list"
                            multiple={false}
                        />
                        <datalist id="pacientes-list">
                            {optionsPacientes}
                        </datalist>
                    </div>

                    <form onSubmit={validateFields}>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <br></br>
                        <div className="row">
                            <div className="col mb-6">
                                <label className="form-label">Apellido y Nombres:</label>
                                <input
                                    value={apellidoConNombre}
                                    onChange={(e) => setApellidoConNombre(e.target.value)}
                                    type="text"
                                    className="form-control"
                                    disabled={!editable}
                                    required
                                />
                            </div>
                            <div className="col mb-6">
                                <label className="form-label">DNI:</label>
                                <input
                                    value={idc}
                                    onChange={(e) => setIdc(e.target.value)}
                                    type="number"
                                    className="form-control"
                                    disabled={!editable}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-6">
                                <label className="form-label">Tratamiento:</label>
                                <select
                                    value={tratamientoControl}
                                    onChange={(e) => {
                                        setTratamientoControl(e.target.value)
                                    }}
                                    className="form-control"
                                    multiple={false}
                                    required
                                >
                                    <option value="">Selecciona un Tratamiento</option>
                                    {optionsTratamientos}
                                </select>
                            </div>
                            <div className="col mb-6">
                                <label className="form-label">Pieza:</label>
                                <input
                                    value={pieza}
                                    onChange={(e) => setPieza(e.target.value)}
                                    type="number"
                                    className="form-control m-1 w-100"
                                />
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="d-flex col-md-8">
                                <label className="col-form-label me-5 w-25">Doctor:</label>
                                <input
                                    value={doctor}
                                    onChange={(e) => setDoctor(e.target.value)}
                                    type="text"
                                    className="form-control m-1 w-100"
                                />
                            </div>
                            <div className="d-flex col-md-8">
                                <label className="col-form-label me-5 w-25">Fecha:</label>
                                <input
                                    value={fechaControlRealizado}
                                    onChange={(e) => setFechaControlRealizado(e.target.value)}
                                    type="date"
                                    className="form-control m-1 w-100"
                                />
                            </div>
                            <div className="d-flex col-md-8">
                                <label className="col-form-label me-5 w-25">Detalle:</label>
                                <textarea
                                    value={detalleTratamiento}
                                    onChange={(e) => setDetalleTratamiento(e.target.value)}
                                    type="text"
                                    className="form-control m-1"
                                    style={{ height: '150px' }}
                                />
                            </div>
                        </div>

                        <br></br>
                        <button
                            type="submit"
                            onClick={validateFields}
                            className="btn btn-primary"
                        >
                            Agregar
                        </button>

                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Create;
