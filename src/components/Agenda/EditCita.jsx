import React, { useState, useEffect, useCallback } from "react";
import { getDoc, updateDoc, doc, query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const EditCita = (props) => {
  const [apellidoConNombre, setApellidoConNombre] = useState(props.cita.apellidoConNombre || "");
  const [tipoIdc, setTipoIdc] = useState(props.cita.tipoIdc || "");
  const [idc, setIdc] = useState(props.cita.idc || "");
  const [estado, setEstado] = useState(props.cita.estado || "");
  const [numero, setNumero] = useState(props.cita.numero || "");
  const [fecha, setFecha] = useState(props.cita.fecha || "");
  const [comentario, setComentario] = useState(props.cita.comentario || "");
  const [horaInicio, setHoraInicio] = useState(props.cita.horaInicio || "");
  const [horaFin, setHoraFin] = useState(props.cita.horaFin || "");
  const [estadoOptions, setOptionsEstado] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [, setHorariosAtencion] = useState([]);
  const [doctor, setDoctor] = useState(props.cita.doctor || "");
  const [doctoresOption, setDoctoresOption] = useState([]);
  const [selectedCode, setSelectedCode] = useState(props.cita.selectedCode || "");

  const updateOptionsEstado = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().name);
    setOptionsEstado(options);
  }, []);

  // En la función render:
  const estadoOptionsJSX = estadoOptions.map((option, index) => (
    <option key={`estado-${index}`} value={option}>{option}</option>
  ));


  const updateOptionsHorarios = useCallback(snapshot => {
    const horarios = snapshot.docs.map(doc => doc.data());
    setHorariosAtencion(horarios);

    const optionsHoraInicio = horarios.map((horario, index) => (
      <option key={`horarioInicio-${index}`} value={horario.id}>{horario.name}</option>
    ));
    setOptionsHoraInicio(optionsHoraInicio);

    const optionsHoraFin = horarios
      .filter(horario => horario.name > horaInicio)
      .map((horario, index) => (
        <option key={`horarioFin-${index}`} value={horario.id}>{horario.name}</option>
      ));
    setOptionsHoraFin(optionsHoraFin);
    setHoraFin(props.cita.horaFin || optionsHoraFin[0]?.props.children);

  }, [horaInicio, props.cita.horaFin]);

  const updateOptionsDoctores = useCallback(snapshot => {
    const docsOptions = snapshot.docs
      .filter(doc => doc.data().uid !== "Recepcionista")
      .map((doc, index) => (
        <option key={`doctores-${index}`}
          value={JSON.stringify({
            uid: doc.data().uid || "admin",
            nombreApellido: doc.data().nombres + " " + doc.data().apellido
          })}>
          {doc.data().nombres + " " + doc.data().apellido}
        </option>
      ));
    setDoctoresOption(docsOptions);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "estados"), orderBy("name")), updateOptionsEstado),
      onSnapshot(query(collection(db, "horariosAtencion"), orderBy("name")), updateOptionsHorarios),
      onSnapshot(query(collection(db, "user"), orderBy("codigo")), updateOptionsDoctores),
    ];

    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsEstado, updateOptionsHorarios, updateOptionsDoctores]);

  const update = async (e) => {
    e.preventDefault();
    const citaRef = doc(db, "citas", props.id);
    const citaDoc = await getDoc(citaRef);
    const citaData = citaDoc.data();

    const newData = {
      apellidoConNombre: apellidoConNombre || citaData.apellidoConNombre,
      tipoIdc: tipoIdc || citaData.tipoIdc,
      idc: idc || citaData.idc,
      estado: estado || citaData.estado,
      numero: numero || citaData.numero,
      selectedCode: selectedCode || citaData.selectedCode,
      fecha: fecha || citaData.fecha,
      comentario: comentario || citaData.comentario,
      horaInicio: horaInicio || citaData.horaInicio,
      horaFin: horaFin || citaData.horaFin,
      doctor: doctor || citaData.doctor,
    };
    await updateDoc(citaRef, newData);
    clearFields();
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setTipoIdc("");
    setIdc("");
    setEstado("");
    setNumero("");
    setFecha("");
    setComentario("");
    setHoraInicio("");
    setHoraFin("");
    setDoctor("");
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
        setHoraFin("");
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Editar Cita</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="col">
            <form onSubmit={update} style={{ transform: "scale(0.96)" }}>
              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">IDC</label>
                  <div style={{ display: "flex" }}>
                    <select
                      defaultValue={props.cita.tipoIdc}
                      onChange={(e) => { setTipoIdc(e.target.value); setIdc("") }}
                      className="form-control-tipoIDC"
                      multiple={false}
                      style={{ width: "fit-content" }}
                      required
                    >
                      <option value="dni">DNI</option>
                      <option value="ce">CE</option>
                      <option value="ruc">RUC</option>
                      <option value="pas">PAS</option>

                    </select>
                    <input
                      defaultValue={props.cita.idc}
                      onChange={(e) => setIdc(e.target.value)}
                      type={tipoIdc === "dni" || tipoIdc === "ruc" ? "number" : "text"}
                      minLength={tipoIdc === "dni" ? 8 : undefined}
                      maxLength={tipoIdc === "dni" ? 8 : tipoIdc === "ruc" ? 11 : tipoIdc === "ce" || tipoIdc === "pas" ? 12 : undefined}
                      onKeyDown={(e) => {
                        const maxLength = e.target.maxLength;
                        const currentValue = e.target.value;
                        const isTabKey = e.key === "Tab";
                        const isDeleteKey = e.key === "Delete" || e.key === "Supr" || e.key === "Backspace";
                        if (maxLength && currentValue.length >= maxLength && !isTabKey && !isDeleteKey) {
                          e.preventDefault();
                        }
                      }}
                      className="form-control"
                    />

                  </div>
                </div>

                <div className="col mb-3">
                  <label className="form-label">Apellido y Nombres</label>
                  <input
                    defaultValue={props.cita.apellidoConNombre}
                    onChange={(e) => setApellidoConNombre(e.target.value)}
                    type="text"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Doctor*</label>
                  <select
                    defaultValue={props.cita.doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="form-control"
                    multiple={false}
                    required
                  >
                    {doctoresOption}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col mb-6">
                  <label className="form-label">Fecha</label>
                  <input
                    defaultValue={props.cita.fecha}
                    onChange={(e) => { setFecha(e.target.value); setEstado("Agendada") }}
                    type="date"
                    className="form-control"
                  />
                </div>
                <div className="col mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    defaultValue={props.cita.estado}
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
                <div className="col mb-3">
                  <label className="form-label">Hora Inicio</label>
                  <select
                    defaultValue={props.cita.horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    {optionsHoraInicio}
                  </select>
                </div>
                <div className="col mb-3">
                  <label className="form-label">Hora Fin</label>
                  <select
                    defaultValue={props.cita.horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    className="form-control"
                    multiple={false}
                  >
                    {optionsHoraFin}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono*</label>
                <div style={{ display: "flex" }}>
                  <select
                    defaultValue={props.cita.selectedCode}
                    onChange={(e) => {
                      const codArea = e.target.value;
                      setSelectedCode(codArea);
                      if (codArea !== "+51") {
                        setNumero("");
                      }
                    }}
                    className="form-control-tipoIDC me-1"
                    multiple={false}
                    style={{ width: "fit-content" }}
                  >
                    <option value="">Otro Pais</option>
                    <option value="+51">Perú (+51)</option>
                  </select>
                  {selectedCode !== "+51" && (
                    <input
                      defaultValue={props.cita.selectedCode}
                      onChange={(e) => {
                        setSelectedCode(e.target.value);
                      }}
                      className="form-control-tipoIDC me-1"
                      type="text"
                      style={{ width: "fit-content" }}
                      placeholder="Cod. area"
                    />
                  )}
                  <input
                    defaultValue={props.cita.numero}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Notas</label>
                  <input
                    defaultValue={props.cita.comentario}
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
                className="btn button-main"
              >
                Editar
              </button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditCita;