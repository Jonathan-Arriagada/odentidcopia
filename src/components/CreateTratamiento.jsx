import React, { useState, useCallback, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

function CreateTratamiento(props) {
  const [apellidoConNombres, setApellidoConNombres] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [pieza, setPieza] = useState([]);
  const [saldo, setSaldo] = useState("");
  const [estadosTratamientos, setEstadosTratamientos] = useState("");
  const [optionsEstadosTratamientos, setOptionsEstadosTratamientos] = useState([]);
  const [notas, setNotas] = useState("");


  const tratamientosCollection = collection(db, "tratamientos");

  const updateOptionsEstadosTratamientos = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => (
      <option key={`estadosTratamientos-${doc.id}`} value={doc.estadosTratamientos}>{doc.data().name}</option>
    ));
    setOptionsEstadosTratamientos(options);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos),
    ];
  
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstadosTratamientos]);

  const store = async (e) => {
    e.preventDefault();
    await addDoc(tratamientosCollection, {
      apellidoConNombres: apellidoConNombres,
      tratamiento: tratamiento,
      pieza: pieza,
      saldo: saldo,
      estadosTratamientos: estadosTratamientos,
      notas: notas,
    });
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
          <h1>Crear Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form onSubmit={store}>
                <div className="mb-3">
                  <label className="form-label">Apellido y Nommbres</label>
                  <input
                    value={apellidoConNombres}
                    onChange={(e) => setApellidoConNombres(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tratamiento</label>
                  <input
                    value={tratamiento}
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
                    value={saldo}
                    onChange={(e) => setSaldo(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>        
                <div className="mb-3">
                  <label className="form-label">Estado del Tratamiento</label>
                   <select
                    value={estadosTratamientos}
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
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
                <button type="submit" onClick={props.onHide} className="btn btn-primary">Agregar</button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateTratamiento;