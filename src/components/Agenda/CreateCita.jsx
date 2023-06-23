import React, { useState, useEffect, useCallback } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import peruFlag from "../../img/peru.png"
import moment from "moment";

function CreateCita(props) {
  const hoy = moment(new Date()).format("YYYY-MM-DD");
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idPacienteCita, setIdPacienteCita] = useState("");
  const [idc, setIdc] = useState("");
  const [tipoIdc, setTipoIdc] = useState("dni");
  const [estado, setEstado] = useState("Agendada");
  const [selectedCode, setSelectedCode] = useState("+51");
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("08:30");
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [doctor, setDoctor] = useState("");
  const [editable, setEditable] = useState(true);
  const [estadoOptions, setEstadoOptions] = useState([]);
  const [optionsHoraInicio, setOptionsHoraInicio] = useState([]);
  const [optionsHoraFin, setOptionsHoraFin] = useState([]);
  const [doctoresOption, setDoctoresOption] = useState([]);
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);
  const [, setHorariosAtencion] = useState([]);
  const [showBuscador, setShowBuscador] = useState(true);

  const citasCollection = collection(db, "citas");

  const updateOptionsEstado = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => doc.data().name);
    setEstadoOptions(options);
  }, []);

  const updateOptionsPacientes = useCallback((snapshot) => {
    const options = snapshot.docs.map((doc) => doc.data().valorBusqueda);
    setValorBusquedaOptions(options);
  }, []);

  //Render:
  const estadoOptionsJSX = estadoOptions.map((option, index) => (
    <option key={`estado-${index}`} value={option}>
      {option}
    </option>
  ));
  const valorBusquedaOptionsJSX = valorBusquedaOptions.map((option, index) => (
    <option key={`valorBusqueda-${index}`} value={option}>
      {option}
    </option>
  ));

  const updateOptionsHorarios = useCallback(
    (snapshot) => {
      const horarios = snapshot.docs.map((doc) => doc.data());
      setHorariosAtencion(horarios);

      const optionsHoraInicio = horarios.map((horario, index) => (
        <option key={`horarioInicio-${index}`} value={horario.id}>
          {horario.name}
        </option>
      ));
      optionsHoraInicio.pop();
      setOptionsHoraInicio(optionsHoraInicio);

      if (horaInicio) {
        const optionsHoraFin = horarios
          .filter((horario) => horario.name > horaInicio)
          .map((horario, index) => (
            <option key={`horarioFin-${index}`} value={horario.id}>
              {horario.name}
            </option>
          ));
        setHoraFin(optionsHoraFin[0]?.props.children);
        setOptionsHoraFin(optionsHoraFin);
      }
    },
    [horaInicio]
  );

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
      onSnapshot(
        query(collection(db, "clients"), orderBy("valorBusqueda")),
        updateOptionsPacientes
      ),
      onSnapshot(
        query(collection(db, "estados"), orderBy("name")),
        updateOptionsEstado
      ),
      onSnapshot(
        query(collection(db, "horariosAtencion"), orderBy("name")),
        updateOptionsHorarios
      ),
      onSnapshot(
        query(collection(db, "user"), orderBy("codigo")),
        updateOptionsDoctores
      ),
    ];

    return () => unsubscribe.forEach((fn) => fn());
  }, [updateOptionsPacientes, updateOptionsEstado, updateOptionsHorarios, updateOptionsDoctores]);

  useEffect(() => {
    if (props.client) {
      setApellidoConNombre(props.client.apellidoConNombre);
      setTipoIdc(props.client.tipoIdc);
      setIdc(props.client.idc);
      setSelectedCode(props.client.selectedCode);
      setNumero(props.client.numero);
      setIdPacienteCita(props.client.id);
      setShowBuscador(false);
      setEditable(false);
    } else {
      setApellidoConNombre("");
      setTipoIdc("dni")
      setIdc("");
      setIdPacienteCita("");
      setSelectedCode("+51");
      setNumero("");
    }
  }, [props.client]);

  useEffect(() => {
    const fetchClient = async () => {
      if (props.id) {
        setShowBuscador(false);
        const docRef = doc(db, "clients", props.id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setApellidoConNombre(data.apellidoConNombre);
          setTipoIdc(data.tipoIdc);
          setIdc(data.idc);
          setSelectedCode(data.selectedCode);
          setNumero(data.numero);
          setIdPacienteCita(props.id);
          setEditable(false);
        }
      }
    };

    fetchClient();
  }, [props.id, apellidoConNombre]);

  const store = async (e) => {
    e.preventDefault();
    var mesVariable = moment(fecha).locale("es").format("MMMM");

    await addDoc(citasCollection, {
      apellidoConNombre: apellidoConNombre,
      tipoIdc: tipoIdc,
      idc: idc,
      idPacienteCita: idPacienteCita,
      estado: estado,
      selectedCode: selectedCode,
      numero: numero,
      fecha: fecha,
      mes: mesVariable,
      comentario: comentario,
      horaInicio: horaInicio,
      horaFin: horaFin,
      doctor: doctor,
    });
    clearFields();
    props.onHide();

  };

  const manejarValorSeleccionado = async (suggestion) => {
    if (suggestion === "") {
      setApellidoConNombre("");
      setIdPacienteCita("")
      setTipoIdc("dni")
      setIdc("");
      setSelectedCode("+51");
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
      setTipoIdc(data.tipoIdc);
      setIdc(data.idc);
      setSelectedCode(data.selectedCode);
      setNumero(data.numero);
      setEditable(false);
    }
  };

  const clearFields = () => {
    setApellidoConNombre("");
    setTipoIdc("dni")
    setIdc("");
    setSelectedCode("+51");
    setNumero("");
    setEstado("Agendada");
    setFecha("");
    setHoraInicio("08:00");
    setHoraFin("08:30");
    setComentario("");
    setNumero("");
    setDoctor("");
  };

  const validateFields = (e) => {
    e.preventDefault();
    if (
      apellidoConNombre.trim() === "" ||
      idc.trim() === "" ||
      numero.trim() === "" ||
      fecha.trim() === "" ||
      horaInicio.trim() === "" ||
      horaFin.trim() === "" ||
      doctor.trim() === ""
    ) {
      setError("Respeta los campos obligatorios *");
      setTimeout(clearError, 2000);
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
        clearFields();
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Cita</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="col">
            <div className="row">
              {showBuscador && (<div className="col-6 mb-2" style={{ display: "flex" }}>
                <input
                  placeholder="Buscador por Apellido, Nombre o DNI"
                  type="text"
                  className="form-control"
                  onChangeCapture={(e) =>
                    manejarValorSeleccionado(e.target.value)
                  }
                  list="pacientes-list"
                  multiple={false}
                  style={{ height: "43px" }}
                />

                <datalist id="pacientes-list">
                  {valorBusquedaOptionsJSX}
                </datalist>
                <i className="fa-solid fa-magnifying-glass" style={{ display: "flex", alignItems: "center", marginLeft: "-26px" }}></i>
              </div>)}
              <div className="col-6 mb-2 align-items-center" style={{ display: "flex" }}>
                <label className="form-label" style={{ marginRight: "5px", marginTop: "4px" }}>Doctor*</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="form-control"
                  multiple={false}
                  required
                >
                  <option value="">Selecciona un doctor...</option>
                  {doctoresOption}
                </select>
              </div>
            </div>

            <form style={{ transform: "scale(0.98)" }}>
              <div className="row">
                <div className="col-6 mb-2">
                  <label className="form-label">IDC*</label>
                  <div style={{ display: "flex" }}>
                    <select
                      value={tipoIdc}
                      onChange={(e) => { setTipoIdc(e.target.value); setIdc("") }}
                      className={!editable ? "form-control-selectedCode me-1" : "form-control-tipoIDC me-1"}
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
                      value={idc || ""}
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
                      disabled={!editable}
                      required
                    />
                  </div>
                </div>

                <div className="col-6 mb-2">
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

              </div>

              <div className="row">
                <div className="col-8 mb-2">
                  <label className="form-label">Teléfono*</label>
                  <div style={{ display: "flex" }}>
                    {selectedCode === "+51" && (
                      <img
                        src={peruFlag}
                        alt="Bandera de Perú"
                        style={{ width: "45px", marginRight: "4px" }}
                      />
                    )}
                    <select
                      value={selectedCode}
                      onChange={(e) => {
                        const codArea = e.target.value;
                        setSelectedCode(codArea);
                        if (codArea !== "+51") {
                          setNumero("");
                        }
                      }}
                      className="form-control-tipoIDC me-1"
                      multiple={false}
                      disabled={!editable}
                      style={{ width: "fit-content" }}
                      required
                    >
                      <option value="">Otro Pais</option>
                      <option value="+51">Perú (+51)</option>
                    </select>
                    {selectedCode !== "+51" && (
                      <input
                        value={selectedCode}
                        onChange={(e) => {
                          setSelectedCode(e.target.value);
                        }}
                        className="form-control-tipoIDC me-1"
                        type="text"
                        style={{ width: "fit-content" }}
                        placeholder="Cod. area"
                        disabled={!editable}
                        required
                      />
                    )}
                    <input
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      type="number"
                      className="form-control"
                      disabled={!editable}
                      required
                    />
                  </div>
                </div>
                <div className="col-4 mb-2">
                  <label className="form-label">Estado*</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="form-control"
                    multiple={false}
                    required
                  >
                    {estadoOptionsJSX}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-4 mb-2">
                  <label className="form-label">Fecha*</label>
                  <input
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    type="date"
                    className="form-control"
                    min={hoy}
                    required
                  />
                </div>

                <div className="col-4 mb-2">
                  <label className="form-label">Hora Inicio*</label>
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
                <div className="col-4 mb-2">
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
                <div className="col-6 mb-2">
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
                <button
                  type="submit"
                  onClick={validateFields}
                  className="btn button-main"
                  style={{ margin: "1px" }}
                >
                  Agregar
                </button>
                {error && (
                  <div
                    className="alert alert-danger"
                    role="alert"
                    style={{ margin: "10px" }}
                  >
                    {error}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default CreateCita;
