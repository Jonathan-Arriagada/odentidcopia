import React, { useState, useCallback, useEffect, useContext } from "react";
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

function CreateTratamiento(props) {
  const [codigo, setCodigo] = useState(null);
  const [apellidoConNombre, setApellidoConNombre] = useState("");
  const [idPaciente, setIdPaciente] = useState("");
  const [tipoIdc, setTipoIdc] = useState("dni");
  const [idc, setIdc] = useState("");
  const [cta, setCta] = useState("");
  const [precio, setPrecio] = useState("");
  const [tarifasTratamientos, setTarifasTratamientos] = useState("");
  const [formaPago, setFormaPago] = useState("contado");
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

  const [editable, setEditable] = useState(false);

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
      <option key={`tarifasTratamientos-${doc.id}`} value={doc.tarifasTratamientos}>{doc.data().tratamiento}</option>
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
    })
  }

  const validateFields = (e) => {
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
    setIdPaciente("")
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
    await addDoc(tratamientosCollection, {
      codigo: codigo,
      apellidoConNombre: apellidoConNombre,
      idPaciente: idPaciente,
      tipoIdc: tipoIdc,
      idc: idc,
      cta: cta,
      precio: precio,
      formaPago: formaPago,
      tarifasTratamientos: tarifasTratamientos,
      pieza: pieza,
      estadosTratamientos: estadosTratamientos,
      fecha: fecha,
      fechaVencimiento: fechaVencimiento,
      notas: notas,
      cobrosManuales: {
        fechaCobro: [],
        importeAbonado: [],
        tratamientoCobro: [],
        codigoTratamiento: [],
        estadoCobro: [],
        pacienteCobro: [],
      },
    });
    await addDoc(controlesCollection, {
      codigoTratamiento: codigo,
      apellidoConNombre: apellidoConNombre,
      idPaciente: idPaciente,
      tipoIdc: tipoIdc,
      idc: idc,
      tratamientoControl: tarifasTratamientos,
      pieza: pieza,
      fechaControlRealizado: fecha,
      detalleTratamiento: "1° Tratamiento Iniciado: " + notas,
      doctor: currentUser.displayName,
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


  const manejarValorSeleccionado = async (suggestion) => {
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
  }, [props.id]);

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
            <div className="col mb-3" style={{ position: "relative" }}>
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
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "10px",
                  transform: "translateY(-60%)",
                }}
              >
                <FaSearch />
              </span>
              <datalist id="pacientes-list">
                <option value="">Ingreso manual</option>
                {valorBusquedaOptionsJSX}
              </datalist>
            </div>
          )}

          <form style={{ transform: "scale(0.96)" }}>
            <div className="row">
              <div className="col mb-3">
                <label className="form-label">IDC*</label>
                <div style={{ display: "flex" }}>
                  <select
                    value={tipoIdc}
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
                    value={idc}
                    onChange={(e) => setIdc(e.target.value)}
                    type={tipoIdc === "dni" || tipoIdc === "ruc" ? "number" : "text"}
                    minLength={tipoIdc === "dni" ? 8 : undefined}
                    maxLength={tipoIdc === "dni" ? 8 : tipoIdc === "ruc" ? 11 : tipoIdc === "ce" || tipoIdc === "pas" ? 12 : undefined}
                    onKeyDown={(e) => {
                      const maxLength = e.target.maxLength;
                      const currentValue = e.target.value;
                      const isTabKey = e.key === "Tab";
                      if (maxLength && currentValue.length >= maxLength && !isTabKey) {
                        e.preventDefault();
                      }
                    }}
                    className="form-control"
                    disabled={!editable}
                    required
                  />
                </div>
              </div>
              <div className="col mb-3">
                <label className="form-label">Apellido y Nombres*</label>
                <input
                  value={apellidoConNombre}
                  onChange={(e) => setApellidoConNombre(e.target.value)}
                  type="text"
                  className="form-control"
                  disabled={!editable}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col mb-3">
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
              <div className="col mb-3">
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
              <div className="col mb-2">
                <label className="form-label">Forma de Pago</label>
                <select
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  className="form-control"
                  multiple={false}
                  required
                >
                  <option value="contado">Contado</option>
                  <option value="cuotas">Cuotas</option>
                </select>
              </div>

              <div className="col mb-2">
                <label className="form-label">Precio</label>
                <input
                  value={precio}
                  type="number"
                  className="form-control"
                  disabled={true}
                />
              </div>

              <div className="col mb-2">
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
              <div className="col mb-3">
                <label className="form-label">Fecha*</label>
                <input
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  type="date"
                  className="form-control"
                  required
                />
              </div>
              {formaPago === "cuotas" && (<div className="col mb-3">
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
            <div style={{ display: "flex" }}>
              <button type="submit" onClick={validateFields} className="btn btn-primary" style={{ margin: '10px' }}>
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
