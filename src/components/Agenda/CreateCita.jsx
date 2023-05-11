import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, where } from "firebase/firestore";
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
  const [estadoOptions, setEstadoOptions] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);
  const [, setHorariosAtencion] = useState([]);

  const citasCollection = collection(db, "citas");

  const updateOptionsEstado = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().name);
    setEstadoOptions(options);
  }, []);

  const updateOptionsPacientes = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().valorBusqueda);
    options.unshift("<---Ingreso manual--->");
    setValorBusquedaOptions(options);
  }, []);

  //Render:
  const estadoOptionsJSX = estadoOptions.map((option, index) => (
    <option key={`estado-${index}`} value={option}>{option}</option>
  ));
  const valorBusquedaOptionsJSX = valorBusquedaOptions.map((option, index) => (
    <option key={`valorBusqueda-${index}`} value={option}>{option}</option>
  ));

  const updateOptionsHorarios = useCallback(snapshot => {
    const horarios = snapshot.docs.map(doc => doc.data());
    setHorariosAtencion(horarios);

    const optionsHoraInicio = horarios.map((horario, index) => (
      <option key={`horarioInicio-${index}`} value={horario.id}>{horario.name}</option>
    ));
    setOptionsHoraInicio(optionsHoraInicio);

    if (horaInicio) {
      const optionsHoraFin = horarios
        .filter(horario => horario.name > horaInicio)
        .map((horario, index) => (
          <option key={`horarioFin-${index}`} value={horario.id}>{horario.name}</option>
        ));
      setOptionsHoraFin(optionsHoraFin);
      setHoraFin(optionsHoraFin[0]?.props.children || horaFin);
    }
  }, [horaInicio, horaFin]);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "clients"), orderBy("valorBusqueda")), updateOptionsPacientes),
      onSnapshot(query(collection(db, "estados"), orderBy("name")), updateOptionsEstado),
      onSnapshot(query(collection(db, "horariosAtencion"), orderBy("name")), updateOptionsHorarios),
    ];

    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsPacientes, updateOptionsEstado, updateOptionsHorarios]);

  useEffect(() => {
    if (props.client) {
    setApellidoConNombre(props.client.apellidoConNombre);
    setIdc(props.client.idc);
    setNumero(props.client.numero);
    setEditable(false);
  } else {
    setApellidoConNombre("");
    setIdc("");
    setNumero("");
  }
  }, [props.client]);

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
  };

  const manejarValorSeleccionado = async (suggestion) => {
    if (suggestion === "<---Ingreso manual--->" || suggestion === "") {
      setApellidoConNombre("");
      setIdc("");
      setNumero("");
      setEditable(true);
      return;
    }

    const querySnapshot = await getDocs(
      query(collection(db, "clients"), where("valorBusqueda", "==", suggestion))
    );

    const doc = querySnapshot.docs[0];

    if (doc) {
      const data = doc.data();
      setApellidoConNombre(data.apellidoConNombre);
      setIdc(data.idc);
      setNumero(data.numero);
      setEditable(false);
    }
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton onClick={() => {
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
            <div className="col mb-3" style={{ background: "#23C9FF", padding: "6px", borderRadius: "20px" }}>
              <label className="form-label" style={{ marginLeft: "15px", fontWeight: "bold" }}>Buscador por Apellido, Nombre o DNI:</label>
              <input
                style={{ borderRadius: "100px" }}
                type="text"
                className="form-control"
                onChangeCapture={(e) => manejarValorSeleccionado(e.target.value)}
                list="pacientes-list"
                multiple={false}
              />
              <datalist id="pacientes-list">
                <option value="">Ingreso manual</option>
                {valorBusquedaOptionsJSX}
              </datalist>
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
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Hora Inicio</label>
                  <select
                    value={horaInicio}
                    onChange={(e) =>
                      setHoraInicio(e.target.value)}
                    className="form-control"
                    multiple={false}
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
              <button type="submit" onClick={props.onHide} className="btn btn-primary" style={{ margin: '1px' }}>Agregar</button>
            </form>
          </div>
        </div>

      </Modal.Body>
    </Modal >
  );
}

export default CreateCita;
