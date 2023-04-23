import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'

const CreateTarifa = () => {
  const [codigo, setCodigo] = useState([]);
  const [tratamiento, setTratamiento] = useState("");
  const [tarifa, setTarifa] = useState("");
  const navigate = useNavigate();

  const tarifasCollection = collection(db, "tarifas");

  const store = async (e) => {
    e.preventDefault();
    await addDoc(tarifasCollection, {
      codigo: codigo,
      tratamiento: tratamiento,
      tarifa: tarifa,
    });
    navigate("/tarifas");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Crear Tarifa</h1>

          <form onSubmit={store}>
            <div className="mb-3">
              <label className="form-label">Codigo</label>
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                type="number"
                className="form-control"
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
              <label className="form-label">Tarifa</label>
              <input
                value={tarifa}
                onChange={(e) => setTarifa(e.target.value)}
                type="text"
                className="form-control"
              />
            </div>
            <button type='submit' className='btn btn-primary'>Agregar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTarifa;