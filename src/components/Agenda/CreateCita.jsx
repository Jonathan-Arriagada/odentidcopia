import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

function CreateCita(props) {
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idPacienteCita, setIdPacienteCita] = useState("");
  const [idc, setIdc] = useState("");
  const [estado, setEstado] = useState("");
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("08:30");
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [editable, setEditable] = useState(true);
  const [estadoOptions, setEstadoOptions] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);
  const [, setHorariosAtencion] = useState([]);
  const [showBuscador, setShowBuscador] = useState(true);

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
    optionsHoraInicio.pop();
    setOptionsHoraInicio(optionsHoraInicio);

    if (horaInicio) {
      const optionsHoraFin = horarios
        .filter(horario => horario.name > horaInicio)
        .map((horario, index) => (
          <option key={`horarioFin-${index}`} value={horario.id}>{horario.name}</option>
        ));
      setHoraFin(optionsHoraFin[0]?.props.children || horaFin);
      setOptionsHoraFin(optionsHoraFin);
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
      setIdPacienteCita(props.client.id)
      setEditable(false);
    } else {
      setApellidoConNombre("");
      setIdc("");
      setIdPacienteCita("");
      setNumero("");
    }
  }, [props.client]);

  useEffect(() => {
    const fetchClient = async () => {
      if (props.id) {
        setShowBuscador(false);
        const docRef = doc(db, 'clients', props.id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setApellidoConNombre(data.apellidoConNombre);
          setIdc(data.idc);
          setNumero(data.numero);
          setIdPacienteCita(props.id);
          setEditable(false);
        }
      }
    };

    fetchClient();
  }, [props.id]);

  const store = async (e) => {
    e.preventDefault();
    const querySnapshot = await getDocs(query(collection(db, "clients"), where("idc", "==", idc)));
    if (!querySnapshot.empty) {
      await addDoc(citasCollection, {
        apellidoConNombre: apellidoConNombre,
        idc: idc,
        idPacienteCita: idPacienteCita,
        estado: estado,
        numero: numero,
        fecha: fecha,
        comentario: comentario,
        horaInicio: horaInicio,
        horaFin: horaFin,
      });
      clearFields();
      props.onHide();
    } else {
      const clientsRef = await addDoc(collection(db, "clients"), {
        apellidoConNombre: apellidoConNombre,
        idc: idc,
        fechaNacimiento: "",
        numero: numero,
        valorBusqueda: apellidoConNombre + " " + idc,
        edad: "",
        sexo: "",
        lugarNacimiento: "",
        procedencia: "",
        direccion: "",
        ocupacion: "",
        correo: "",
        responsable: "",
        nombreResponsable: "",
        telefonoResponsable: "",
        pregunta1: ["", false],
        pregunta2: ["", false],
        pregunta3: ["", false],
        pregunta4: ["", false],
        pregunta5: ["", false],
        pregunta6: ["", false],
        pregunta7: ["", false],
        pregunta8: ["", false],
        pregunta9: ["", false],
        pregunta10: ["", false],
        pregunta11: ["", false],
        pregunta12: ["", false],
        pregunta13: ["", false],
        pregunta14: ["", false],
        pregunta15: ["", false],
        pregunta16: ["", false],
        pregunta17: ["", false],
        pregunta18: ["", false],
      });

      await addDoc(citasCollection, {
        apellidoConNombre: apellidoConNombre,
        idPacienteCita: clientsRef.id,
        idc: idc,
        estado: estado,
        numero: numero,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin,
        comentario: comentario,
      });
      clearFields();
      props.onHide();
    }
  };

  const manejarValorSeleccionado = async (suggestion) => {
    if (suggestion === "<---Ingreso manual--->" || suggestion === "") {
      setApellidoConNombre("");
      setIdPacienteCita("")
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
      setIdPacienteCita(doc.id)
      setIdc(data.idc);
      setNumero(data.numero);
      setEditable(false);
    }
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setIdPacienteCita("");
    setIdc("");
    setNumero("");
    setEstado("");
    setFecha("");
    setHoraInicio("");
    setHoraInicio("");
    setComentario("");
    setNumero("");
  };

  const validateFields = (e) => {
    if (
      apellidoConNombre.trim() === "" ||
      idc.trim() === "" ||
      estado.trim() === "" ||
      numero.trim() === "" ||
      fecha.trim() === "" ||
      horaInicio.trim() === "" ||
      horaFin.trim() === ""
    ) {
      setError("Respeta los campos obligatorios *");
      setTimeout(clearError, 2000)
      return false;
    } else {
      setError("");
      store(e);
    }
    return true;
  };

  const clearError = () => {
    setError("");
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
            {showBuscador && (<div className="col mb-3" style={{ background: "#23C9FF", padding: "6px", borderRadius: "20px" }}>
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
            </div>)}

            <form>
              <div className="row">
                <div className="col mb-3">
                  <label className="form-label">Apellido y Nombres*</label>
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
                  <label className="form-label">DNI*</label>
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
                  <label className="form-label">Teléfono*</label>
                  <input
                    value={numero || ""}
                    onChange={(e) => setNumero(e.target.value)}
                    type="number"
                    className="form-control"
                    disabled={!editable}
                    required
                  />
                </div>

                <div className="col mb-3 align-content-mb-start fa-align-left">
                  <label className="form-label">Estado*</label>
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
                  <label className="form-label">Fecha*</label>
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
                  <label className="form-label">Hora Inicio*</label>
                  <select
                    value={horaInicio}
                    onChange={(e) =>
                      setHoraInicio(e.target.value)}
                    className="form-control"
                    multiple={false}
                    required
                  >
                    {optionsHoraInicio}
                  </select>
                </div>
                <div className="col mb-3">
                  <label className="form-label">Hora Fin*</label>
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
              <div style={{ display: "flex" }}>
                <button type="submit" onClick={validateFields} className="btn btn-primary" style={{ margin: '1px' }}>Agregar</button>
                {error && (
                  <div className="alert alert-danger" role="alert" style={{ margin: '10px' }}>
                    {error}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

      </Modal.Body>
    </Modal >
  );
}

export default CreateCita;