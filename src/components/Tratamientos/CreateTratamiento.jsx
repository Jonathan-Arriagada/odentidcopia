import React, { useState, useCallback, useEffect, useContext } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, limit, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import 'moment/locale/es';
import moment from "moment";

function CreateTratamiento(props) {
  const hoy = moment(new Date()).format("YYYY-MM-DD");
  const [codigo, setCodigo] = useState(null);
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idPaciente, setIdPaciente] = useState("");
  const [tipoIdc, setTipoIdc] = useState("dni");
  const [idc, setIdc] = useState("");
  const [cta, setCta] = useState("");
  const [precio, setPrecio] = useState("");
  const [tarifasTratamientos, setTarifasTratamientos] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [pieza, setPieza] = useState("");
  const [estadosTratamientos, setEstadosTratamientos] = useState("");
  const [fecha, setFecha] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");
  const [error, setError] = useState("");
  const [showBuscador, setShowBuscador] = useState(true);
  const { currentUser } = useContext(AuthContext);

  const [estadoOptionsTratamientos, setEstadoOptionsTratamientos] = useState([]);
  const [optionsTarifasTratamientos, setOptionsTarifasTratamientos] = useState([]);
  const [valorBusquedaOptions, setValorBusquedaOptions] = useState([]);

  const [, setEditable] = useState(false);

  const tratamientosCollection = collection(db, "tratamientos");
  const controlesCollection = collection(db, "controlEvoluciones")

  const updateOptionsEstadosTratamientos = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().name);
    setEstadoOptionsTratamientos(options);
  }, []);

  const updateOptionsPacientes = useCallback(snapshot => {
    const options = snapshot.docs.map(doc => doc.data().valorBusqueda);
    setValorBusquedaOptions(options);
  }, []);

  //Render:
  const estadoOptionsTratamientosJSX = estadoOptionsTratamientos.map((option, index) => (
    <option key={`estado-${index}`} value={option}>{option}</option>
  ));
  const valorBusquedaOptionsJSX = valorBusquedaOptions.map((option, index) => (
    <option key={`valorBusqueda-${index}`} value={option}>{option}</option>
  ));

  const updateOptionsTarifasTratamientos = useCallback(snapshot => {
    const options2 = snapshot.docs.map(doc => (
      <option key={`tarifasTratamientos-${doc.id}`} value={doc.data().tratamiento}>{doc.data().tratamiento}</option>
    ));
    setOptionsTarifasTratamientos(options2);
  }, []);

  useEffect(() => {
    const unsubscribe = [
      onSnapshot(query(collection(db, "clients"), orderBy("valorBusqueda")), updateOptionsPacientes),
      onSnapshot(query(collection(db, "estadosTratamientos"), orderBy("name")), updateOptionsEstadosTratamientos),
      onSnapshot(query(collection(db, "tarifas"), orderBy("eliminado"), where("eliminado", "!=", true)), updateOptionsTarifasTratamientos),
    ];
    return () => unsubscribe.forEach(fn => fn());
  }, [updateOptionsPacientes, updateOptionsEstadosTratamientos, updateOptionsTarifasTratamientos]);

  useEffect(() => {
    const getCodigo = async () => {
      const querySnapshot = await getDocs(
        query(tratamientosCollection, orderBy("codigo", "desc"), limit(1))
      );
      if (!querySnapshot.empty) {
        const maxCodigo = querySnapshot.docs[0].data().codigo;
        setCodigo(Number(maxCodigo) + 1);
      } else {
        setCodigo(Number(1));
      }
    };
    getCodigo();
  }, [tratamientosCollection]);

  const confirm = () => {
    Swal.fire({
      title: '¡Tratamiento agregado!',
      icon: 'success',
      confirmButtonColor: '#00C5C1'
    })
  }

  const validateFields = (e) => {
    e.preventDefault();
    if (
      apellidoConNombre.trim() === "" ||
      idc.trim() === "" ||
      tarifasTratamientos.trim() === "" ||
      estadosTratamientos.trim() === "" ||
      fecha.trim() === ""
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

  const clearFields = () => {
    setCodigo("")
    setApellidoConNombre("")
    setTipoIdc("dni")
    setIdc("")
    setCta("")
    setPrecio("")
    setTarifasTratamientos("")
    setPieza("")
    setEstadosTratamientos("")
    setFormaPago("")
    setFecha("")
    setFechaVencimiento("")
    setNotas("")
  };

  const store = async (e) => {
    e.preventDefault();
    moment.locale('es')
    var mesVariable = moment(fecha).format("MMMM");
    var tiempoAlta = serverTimestamp();

    const tratamientoDocRef = await addDoc(tratamientosCollection, {
      codigo: codigo,
      apellidoConNombre: apellidoConNombre,
      idPaciente: idPaciente,
      tipoIdc: tipoIdc,
      idc: idc,
      cta: cta,
      precio: precio,
      restoCobro: Number(precio),
      formaPago: formaPago,
      tarifasTratamientos: tarifasTratamientos,
      pieza: pieza,
      estadosTratamientos: estadosTratamientos,
      fecha: fecha,
      mes: mesVariable,
      fechaVencimiento: fechaVencimiento,
      notas: notas,
      timestamp: tiempoAlta,
      cobrosManuales: {
        fechaCobro: [],
        importeAbonado: [],
        tratamientoCobro: [],
        codigoTratamiento: [],
        pacienteCobro: [],
        timestampCobro: [],
      },
    });
    await addDoc(controlesCollection, {
      codigoTratamiento: codigo,
      timestamp: tiempoAlta,
      apellidoConNombre: apellidoConNombre,
      idPaciente: idPaciente,
      tipoIdc: tipoIdc,
      idc: idc,
      tratamientoControl: tarifasTratamientos,
      pieza: pieza,
      fechaControlRealizado: fecha,
      detalleTratamiento: "1° Tratamiento Iniciado: " + notas,
      doctor: currentUser.displayName,
      tratamientoId: tratamientoDocRef.id,
    });
    clearFields();
    props.onHide();
    confirm();
  };

  async function buscarTratamiento(tratamiento) {
    const q = query(
      collection(db, "tarifas"),
      where("tratamiento", "==", tratamiento)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      setCta(querySnapshot.docs[0].data().codigo);
      setPrecio(querySnapshot.docs[0].data().tarifa);
    } else {
      setCta("");
      setPrecio("");
    }
  }

  useEffect(() => {
    if (fecha === "") {
      setFecha(hoy);
    }
    if (formaPago === "") {
      setFormaPago("Contado");
    }
  }, [formaPago, fecha, hoy]);

  const manejarValorSeleccionado = async (suggestion) => {
    if (suggestion === "") {
      setApellidoConNombre("");
      setIdPaciente("")
      setTipoIdc("dni")
      setIdc("");
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
      setTipoIdc(data.tipoIdc);
      setIdc(data.idc);
      setIdPaciente(doc.id)
      setEditable(false);
    }
  };

  useEffect(() => {
    const fetchClient = async () => {
      if (props.id) {
        setShowBuscador(false);
        const docRef = doc(db, 'clients', props.id);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setApellidoConNombre(data.apellidoConNombre);
          setTipoIdc(data.tipoIdc);
          setIdc(data.idc);
          setIdPaciente(props.id);
          setEditable(false);
        }
      }
    };

    fetchClient();
  }, [props.id, apellidoConNombre]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton onClick={() => { clearFields(); props.onHide(); }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Tratamiento</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          {showBuscador && (
            <div className="col-6 mb-2" style={{ display: "flex" }}>
              <input
                placeholder="Buscador por Apellido, Nombre o DNI"
                type="text"
                className="form-control"
                onChangeCapture={(e) =>
                  manejarValorSeleccionado(e.target.value)
                }
                list="pacientes-list"
                multiple={false}
              />
              <i className="fa-solid fa-magnifying-glass" style={{ display: "flex", alignItems: "center", marginLeft: "-26px" }}></i>
              <datalist id="pacientes-list">
                {valorBusquedaOptionsJSX}
              </datalist>
            </div>
          )}

          <form style={{ transform: "scale(0.98)" }}>
            <div className="row">
              <div className="col-6 mb-2">
                <label className="form-label">IDC*</label>
                <div style={{ display: "flex" }}>
                  <select
                    value={tipoIdc}
                    onChange={(e) => { setTipoIdc(e.target.value); setIdc("") }}
                    className={"form-control-selectedCode me-1"}
                    multiple={false}
                    style={{ width: "fit-content" }}
                    disabled
                    required
                  >
                    <option value="dni">DNI</option>
                    <option value="ce">CE</option>
                    <option value="ruc">RUC</option>
                    <option value="pas">PAS</option>

                  </select>
                  <input
                    value={idc}
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
                    disabled
                    required
                  />
                </div>
              </div>
              <div className="col-6 mb-2">
                <label className="form-label">Apellido y Nombres*</label>
                <input
                  value={apellidoConNombre}
                  onChange={(e) => setApellidoConNombre(e.target.value)}
                  type="text"
                  className="form-control"
                  disabled
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-6 mb-2">
                <label className="form-label">Tratamiento*</label>
                <select
                  value={tarifasTratamientos}
                  onChange={(e) => {
                    setTarifasTratamientos(e.target.value)
                    buscarTratamiento(e.target.value)
                  }}
                  className="form-control"
                  multiple={false}
                  required
                >
                  <option value="">Selecciona un Tratamiento</option>
                  {optionsTarifasTratamientos}
                </select>
              </div>
              <div className="col-6 mb-2">
                <label className="form-label">Estado del Tratamiento*</label>
                <select
                  value={estadosTratamientos}
                  onChange={(e) => setEstadosTratamientos(e.target.value)}
                  className="form-control"
                  multiple={false}
                  required
                >
                  <option value="">Selecciona un estado</option>
                  {estadoOptionsTratamientosJSX}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-4 mb-2">
                <label className="form-label">Forma de Pago</label>
                <select
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  className="form-control"
                  multiple={false}
                  required
                >
                  <option value="Contado">Contado</option>
                  <option value="Cuotas">Cuotas</option>
                </select>
              </div>

              <div className="col-4 mb-2">
                <label className="form-label">Precio</label>
                <input
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  type="number"
                  className="form-control"
                />
              </div>

              <div className="col-4 mb-2">
                <label className="form-label">Pieza</label>
                <input
                  value={pieza}
                  onChange={(e) => setPieza(e.target.value)}
                  type="number"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row">
              <div className="col mb-2">
                <label className="form-label">Fecha*</label>
                <input
                  value={hoy}
                  onChange={(e) => setFecha(e.target.value)}
                  type="date"
                  className="form-control"
                  max={hoy}
                />
              </div>
              {formaPago === "Cuotas" && (<div className="col-6 mb-2">
                <label className="form-label">Fecha Vencimiento*</label>
                <input
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  type="date"
                  className="form-control"
                  required
                />
              </div>)}
            </div>

            <div className="row">
              <div className="col-12 mb-2">
                <label className="form-label">Notas</label>
                <input
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <button type="submit" onClick={validateFields} className="btn button-main" style={{ margin: '10px' }}>
                Agregar
              </button>
              {error && (
                <div className="alert alert-danger" role="alert" style={{ margin: '10px' }}>
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </Modal.Body >
    </Modal >
  );
}

export default CreateTratamiento;
