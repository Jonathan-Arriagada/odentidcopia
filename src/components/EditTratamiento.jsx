import React, { useCallback, useState, useEffect } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditTratamiento = (props) => {
  const [apellido, setApellido] = useState(props.tratamiento.apellido || "");
  const [nombre, setNombre] = useState(props.tratamiento.nombre || "");
  const [tratamiento, setTratamiento] = useState(props.tratamiento.tratamiento || "");
  const [pieza, setPieza] = useState(props.tratamiento.pieza || "");
  const [saldo, setSaldo] = useState(props.tratamiento.saldo || "");
  const [estadoPago, setEstadoPago] = useState([]);
  const [estadoTratamiento, setEstadoTratamiento] = useState([]);
  const [optionsEstado, setOptionsEstado] = useState([]);
  const [optionsEstadoPago, setOptionsEstadoPago] = useState([]);

  const updateOptionsEstado = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => (
      <option key={`estado-${doc.id}`} value={doc.estados}>
        {doc.data().name}
      </option>
    ));
    setOptionsEstado(options);
  }, []);

  const updateOptionsEstadoPago = useCallback(snapshot => {
    const optionsPago = snapshot.docs.map(doc => (
      <option key={`estadoPago-${doc.id}`} value={doc.estadoPago}>{doc.data().name}</option>
    ));
    setOptionsEstadoPago(optionsPago);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estados"), orderBy("name")), updateOptionsEstado),
      onSnapshot(query(collection(db, "estadoPago"), orderBy("name")), updateOptionsEstadoPago)      
    ];

    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstado, updateOptionsEstadoPago]);

  const update = async (e) => {
    e.preventDefault();
    const tratamientoRef = doc(db, "tratamientos", props.id);
    const tratamientoDoc = await getDoc(tratamientoRef);
    const tratamientoData = tratamientoDoc.data();

    const newData = {
      nombre: nombre || tratamientoData.nombre,
      apellido: apellido || tratamientoData.apellido,
      tratamiento: tratamiento || tratamientoData.tratamiento,
      pieza: pieza || tratamientoData.pieza,
      saldo: saldo || tratamientoData.saldo,
      estadoPago: estadoPago || tratamientoData.estadoPago,
      estadoTratamiento: estadoTratamiento || tratamientoData.estadoTratamiento,
    };
    await updateDoc(tratamientoRef, newData);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Editar Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={update}>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input
                    value={props.tratamiento.apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    value={props.tratamiento.nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input
                    value={props.tratamiento.tratamiento}
                    onChange={(e) => setTratamiento(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pieza</label>
                  <input
                    value={pieza}
                    onChange={(e) => setPieza(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Saldo</label>
                  <input
                    value={props.tratamiento.saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-1">
                  <label className="form-label">Estado del Pago</label>
                  <select
                    value={estadoPago}
                    onChange={(e) => setEstadoPago(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un estado</option>
                    {optionsEstadoPago}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado del Tratamiento</label>
                  <select
                    value={estadoTratamiento}
                    onChange={(e) => setEstadoTratamiento(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un estado</option>
                    {optionsEstado}
                  </select>
                </div>
                <button
                  type="submit"
                  onClick={props.onHide}
                  className="btn btn-primary"
                >
                  Agregar
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditTratamiento;
