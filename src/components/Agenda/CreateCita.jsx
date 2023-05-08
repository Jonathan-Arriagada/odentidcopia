import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

function CreateCita(props) {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idc, setIdc] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [comentario, setComentario] = useState("");

  const [editable, setEditable] = useState(true);
  const [searchBarStyle, setSearchBarStyle] = useState({ display: 'none' });

  const [estadoOptions, setEstadoOptions] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);

  const [, setHorariosAtencion] = useState([]);

  const citasCollection = collection(db, "citas");

  const updateOptionsEstado = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => (
      <option key={`estado-${doc.id}`} value={doc.data().name}>{doc.data().name}</option>
    ));
    setOptionsEstado(options);
  }, []);

  const updateOptionsHorarios = useCallback(snapshot => {
    const horarios = snapshot.docs.map(doc => doc.data());
    setHorariosAtencion(horarios);

      const optionsHoraInicio = horarios.map((horario, index) => (
        <option key={`horarioInicio-${index}`} value={horario.id}>
          {horario.name}
        </option>
      ));
      setOptionsHoraInicio(optionsHoraInicio);

    const optionsHoraFin = horarios
      .filter(horario => horaInicio && horario.name > horaInicio)
      .map((horario, index) => (
        <option key={`horarioFin-${index}`} value={horario.id}>{horario.name}</option>
      ));
    setOptionsHoraFin(optionsHoraFin);
    setHoraFin(optionsHoraFin[0]?.props.children || horaFin);

  }, [horaInicio,horaFin]);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estados"), orderBy("name")), updateOptionsEstado),
      onSnapshot(query(collection(db, "horariosAtencion"), orderBy("name")), updateOptionsHorarios)
    ];

    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstado, updateOptionsHorarios]);

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
    await addDoc(citasCollection, {
      apellidoConNombre: apellidoConNombre,
      idc: idc,
      estado: estado,
      numero: numero,
      fecha: fecha,
      comentario: comentario,
      horaInicio: horaInicio,
      horaFin: horaFin,
    });
    clearFields();
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setIdc("");
    setEstado("");
    setNumero("");
    setFecha("");
    setHoraInicio("");
    setHoraFin("");
    setComentario("");
  };

  const manejarValorSeleccionado = (apellidoConNombre, idc, numero) => {
    setApellidoConNombre(apellidoConNombre);
    setIdc(idc);
    setNumero(numero);
    setEditable(false);
  }

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={() => {
        setSearchBarStyle({ display: 'none' });
        setEditable(true);
        setApellidoConNombre("");
        setIdc("");
        setNumero("");
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Cita</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="col">
            <div className="col">
              <button type="submit" onClick={habilitarSearchBar} className="btn btn-secondary" style={{ margin: '1px' }}>Busqueda Auto</button>
              <button type="submit" onClick={habilitarInputs} className="btn btn-secondary" style={{ margin: '1px' }}>Ingreso Manual</button>
              <div className="col mb-6" style={searchBarStyle}>
                <SearchBar onValorSeleccionado={manejarValorSeleccionado} />
              </div>
            </div>

            <form onSubmit={store}>
              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    value={apellidoConNombre || ""}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                    disabled={!editable}
                    required
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">DNI</label>
                  <input
                    value={idc || ""}
                    onChange={(e) => setIdc(e.target.value)}
                    type="number"
                    className="form-control"
                    disabled={!editable}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    value={numero || ""}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
                    className="form-control"
                    disabled={!editable}
                  />
                </div>

                <div className="col mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="form-control"
                    multiple={false}
                    required
                  >
                    <option value="">Selecciona un estado</option>
                    {estadoOptionsJSX}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col mb-6">
                  <label className="form-label">Fecha</label>
                  <input
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    type="date"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Hora Inicio</label>
                  <select
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="form-control"
                    multiple={false}
                    required
                  >
                    {optionsHoraInicio}
                  </select>
                </div>
                <div className="col mb-3">
                  <label className="form-label">Hora Fin</label>
                  <select
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="form-control"
                    multiple={false}
                    required
                  >
                    {optionsHoraFin}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Comentarios</label>
                  <input
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>
              <button
                type="submit"
                onClick={() => {
                  props.onHide();
                }}
                className="btn btn-primary"
                style={{ margin: "1px" }}
              >
                Agregar
              </button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateCita;
