import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { Modal } from "react-bootstrap";

const CreateTarifa = (props) => {
  const [codigo, setCodigo] = useState('');
  const [tratamiento, setTratamiento] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [editable] = useState(false);
  const [error, setError] = useState("");

  const tarifasCollection = collection(db, "tarifas");

  useEffect(() => {
    const getCodigo = async () => {
      const querySnapshot = await getDocs(
        query(tarifasCollection, orderBy("codigo", "desc"), limit(1))
      );
      if (!querySnapshot.empty) {
        const maxCodigo = querySnapshot.docs[0].data().codigo;
        setCodigo(Number(maxCodigo) + 1);
      } else {
        setCodigo(1);
      }
    };
    getCodigo();
  }, [tarifasCollection]);

  const store = async (e) => {
    e.preventDefault();
    if (tratamiento === "" || tarifa.trim() === "") {
      setError("El Tratamiento/Tarifa no puede estar vacío");
      return;
    }
    if (tarifaExiste(tratamiento)) {
      setError("El tratamiento ya existe");
      return;
    }
    await addDoc(tarifasCollection, {
      codigo: codigo,
      tratamiento: tratamiento,
      tarifa: tarifa,
      eliminado: false,
    });
    props.onHide();
  };

  const tarifaExiste = async (name) => {
    const q = query(tarifasCollection, where("tratamiento", "==", name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
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
        setTratamiento("")
        setTarifa("")
        setError("")
      }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <h1>Crear Tarifa</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row">
            <div className="col">
              <form style={{ transform: "scale(0.98)" }}>
              {error && <small className="text-danger">{error}</small>}
                <div className="mb-2">
                  <label className="form-label">Codigo</label>
                  <input
                    value={codigo}
                    disabled={!editable}
                    type="number"
                    className="form-control"
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Tratamiento</label>
                  <input
                    value={tratamiento}
                    onChange={(e) => setTratamiento(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Tarifa</label>
                  <input
                    value={tarifa}
                    onChange={(e) => setTarifa(e.target.value)}
                    type="text"
                    className="form-control"
                    required
                  />
                </div>
                <button
                  type="submit"
                  onClick={store}
                  className="btn button-main"
                >
                  Agregar
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTarifa;