import React, { useState, useCallback, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import SearchBar from "./SearchBar";


function CreateTratamiento(props) {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [pieza, setPieza] = useState([]);
  const [saldo, setSaldo] = useState("");
  const [estadosTratamientos, setEstadosTratamientos] = useState("");
  const [optionsEstadosTratamientos, setOptionsEstadosTratamientos] = useState([]);
  const [notas, setNotas] = useState("");

  const [editable, setEditable] = useState(true);
  const [searchBarStyle, setSearchBarStyle] = useState({ display: 'none' });


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

  const clearFields = () => {
    setApellidoConNombre("");
    setIdc("");
    setTratamiento("");
    setPieza("");
    setSaldo("");
    setEstadosTratamientos("");
    setEditable(true);
  };

  const habilitarInputs = () => {
    setSearchBarStyle({ display: 'none' });
    setApellidoConNombre("");
    setIdc("");
    setEditable(true);
  };

  const habilitarSearchBar = () => {
    setSearchBarStyle({ display: 'block' });
    setEditable(false);
  }

  const store = async (e) => {
    e.preventDefault();
    await addDoc(tratamientosCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      tratamiento: tratamiento,
      pieza: pieza,
      saldo: saldo,
      estadosTratamientos: estadosTratamientos,
      notas: notas,
    });
    clearFields();
  };

  const manejarValorSeleccionado = (apellidoConNombre, idc) => {
    setApellidoConNombre(apellidoConNombre);
    setIdc(idc);
    setEditable(false);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => {
        setApellidoConNombre("");
        setIdc("");
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <button type="submit" onClick={habilitarSearchBar} className="btn btn-secondary" style={{ margin: '1px' }}>Busqueda Auto</button>
              <button type="submit" onClick={habilitarInputs} className="btn btn-secondary" style={{ margin: '1px' }}>Ingreso Manual</button>
              <form onSubmit={store}>
                <div className="mb-3" style={searchBarStyle}>
                  <SearchBar onValorSeleccionado={manejarValorSeleccionado} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    value={apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    disabled={!editable}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    value={idc}
                    onChange={(e) => setIdc(e.target.value)}
                    type="number"
                    className="form-control"
                    disabled={!editable}
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
                <button type="submit" onClick={props.onHide} className="btn btn-primary" style={{ margin: '1px' }}>Agregar</button>
                <button type="submit" onClick={clearFields} className="btn btn-secondary" style={{ margin: '1px' }}>Limpiar</button>

              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal >
  );
}

export default CreateTratamiento;