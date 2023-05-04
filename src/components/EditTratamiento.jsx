import React, { useState, useEffect, useCallback } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditTratamiento = (props) => {
  const [apellidoConNombres, setApellidoConNombres] = useState(props.tratamiento.apellidoConNombres || "");
  const [tratamiento, setTratamiento] = useState(props.tratamiento.tratamiento || "");
  const [pieza, setPieza] = useState(props.tratamiento.pieza || "");
  const [saldo, setSaldo] = useState(props.tratamiento.saldo || "");
  const [estadosTratamientos, setEstadosTratamientos] = useState(props.tratamiento.estadosTratamientos || "");
  const [notas, setNotas] = useState(props.tratamiento.notas || "");

  const [optionsEstadosTratamientos, setOptionsEstadosTratamientos] = useState([]);

  const updateOptionsEstadosTratamientos = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => (
      <option key={`estadosTratamientos-${doc.id}`} value={doc.data().name}>{doc.data().name}</option>
    ));
    setOptionsEstadosTratamientos(options);
  }, []);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos);
    return unsubscribe;
  }, [updateOptionsEstadosTratamientos]);

  const update = async (e) => {
    e.preventDefault();
    const tratamientoRef = doc(db, "tratamientos", props.id);
    const tratamientoDoc = await getDoc(tratamientoRef);
    const tratamientoData = tratamientoDoc.data();

    const newData = {
      apellidoConNombres: apellidoConNombres || tratamientoData.apellidoConNombres,
      tratamiento: tratamiento || tratamientoData.tratamiento,
      pieza: pieza || tratamientoData.pieza,
      saldo: saldo || tratamientoData.saldo,
      estadosTratamientos: estadosTratamientos || tratamientoData.estadosTratamientos,
      notas: notas || tratamientoData.notas,
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
       <Modal.Header closeButton onClick={() => {
        props.onHide();
      }}>
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
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    defaultValue={props.tratamiento.apellidoConNombres}
                    onChange={(e) => setApellidoConNombres(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input
                    defaultValue={props.tratamiento.tratamiento}
                    onChange={(e) => setTratamiento(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Pieza</label>
                  <input
                    defaultValue={props.tratamiento.pieza}
                    onChange={(e) => setPieza(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Saldo</label>
                  <input
                    defaultValue={props.tratamiento.saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Estado del Tratamiento</label>
                  <select
                    defaultValue={props.tratamiento.estadosTratamientos}
                    onChange={(e) => setEstadosTratamientos(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un estado</option>
                    {optionsEstadosTratamientos}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notas</label>
                  <input
                    defaultValue={props.tratamiento.notas}
                    onChange={(e) => setNotas(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <button
                  type="submit"
                  onClick={() => {
                    props.onHide();
                  }}
                  className="btn btn-primary"
                >
                  Editar
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
