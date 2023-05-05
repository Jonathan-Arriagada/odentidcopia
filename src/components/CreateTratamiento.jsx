import React, { useState, useCallback, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import SearchBar from "./SearchBar";


function CreateTratamiento(props) {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState("");
  const [cant, setCant] = useState("");
  const [tarifasTratamientos, setTarifasTratamientos] = useState("");
  const [pieza, setPieza] = useState("");
  const [plazo, setPlazo] = useState("");
  const [cuota, setCuota] = useState("");
  const [estadosTratamientos, setEstadosTratamientos] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");

  const [optionsEstadosTratamientos, setOptionsEstadosTratamientos] = useState([]);
  const [optionsTarifasTratamientos, setOptionsTarifasTratamientos] = useState([]);

  const [editable, setEditable] = useState(true);
  const [searchBarStyle, setSearchBarStyle] = useState({ display: 'none' });


  const tratamientosCollection = collection(db, "tratamientos");

  const updateOptionsEstadosTratamientos = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => (
      <option key={`estadosTratamientos-${doc.id}`} value={doc.estadosTratamientos}>{doc.data().name}</option>
    ));
    setOptionsEstadosTratamientos(options);
  }, []);

  const updateOptionsTarifasTratamientos = useCallback(snapshot => {
    const options2 = snapshot.docs.map(doc => (
      <option key={`tarifasTratamientos-${doc.id}`} value={doc.tarifasTratamientos}>{doc.data().tratamiento}</option>
    ));
    setOptionsTarifasTratamientos(options2);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos),
      onSnapshot(query(collection(db, "tarifas"), orderBy("tratamiento")), updateOptionsTarifasTratamientos)
    ];
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstadosTratamientos, updateOptionsTarifasTratamientos]);

  const clearFields = () => {
    setApellidoConNombre("");
    setIdc("");
    setCant("")
    setTarifasTratamientos("");
    setPieza("");
    setPlazo("");
    setCuota("")
    setEstadosTratamientos("");
    setFecha("")
    setFechaVencimiento("")
    setNotas("")
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
      cant: cant,
      tarifasTratamientos: tarifasTratamientos,
      pieza: pieza,
      plazo: plazo,
      cuota: cuota,
      estadosTratamientos: estadosTratamientos,
      fecha: fecha,
      fechaVencimiento: fechaVencimiento,
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
        props.onHide();
        setApellidoConNombre("");
        setIdc("");
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="col">
            <div className="col">
              <button type="submit" onClick={habilitarSearchBar} className="btn btn-secondary" style={{ margin: '1px' }}>Busqueda Auto</button>
              <button type="submit" onClick={habilitarInputs} className="btn btn-secondary" style={{ margin: '1px' }}>Ingreso Manual</button>
              <div className="mb-3" style={searchBarStyle}>
                <SearchBar onValorSeleccionado={manejarValorSeleccionado} />
              </div>
            </div>

            <form onSubmit={store}>
              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    value={apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    disabled={!editable}
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">IDC</label>
                  <input
                    value={idc}
                    onChange={(e) => setIdc(e.target.value)}
                    type="number"
                    className="form-control"
                    disabled={!editable}
                  />
                </div>
              </div>

              <div className="row">
              <div className="col mb-3">
                  <label className="form-label">Tratamiento</label>
                  <select
                    value={tarifasTratamientos}
                    onChange={(e) => setTarifasTratamientos(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    <option value="">Selecciona un Tratamiento</option>
                    {optionsTarifasTratamientos}
                  </select>
                </div>
              <div className="col mb-3">
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
              </div>

              <div className="row">
                <div className="col sm-2">
                  <label className="form-label">Pieza</label>
                  <input
                    value={pieza}
                    onChange={(e) => setPieza(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col mb-2">
                  <label className="form-label">Cant</label>
                  <input
                    value={cant}
                    onChange={(e) => setCant(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col sm-2">
                  <label className="form-label">Plazo</label>
                  <input
                    value={plazo}
                    onChange={(e) => setPlazo(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="col sm-2">
                  <label className="form-label">Cuota</label>
                  <input
                    value={cuota}
                    onChange={(e) => setCuota(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col sm-3">
                  <label className="form-label">Fecha</label>
                  <input
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="col sm-3">
                  <label className="form-label">Fecha Vencimiento</label>
                  <input
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    type="date"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Notas</label>
                  <input
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <button type="submit" onClick={props.onHide} className="btn btn-primary" style={{ margin: '1px' }}>Agregar</button>
              <button type="submit" onClick={clearFields} className="btn btn-secondary" style={{ margin: '1px' }}>Limpiar</button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal >
  );
}

export default CreateTratamiento;