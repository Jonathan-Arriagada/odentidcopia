import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function PacientesNuevos(props) {
  const [contadorClientes, setContadorClientes] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "clients"),
      where("fechaAlta", ">=", props.fechaInicio),
      where("fechaAlta", "<=", props.fechaFin)
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cantidad = snapshot.size || 0;
      setContadorClientes(cantidad);
    });
  
    return unsubscribe;
  }, [props]);


  return (
    <div>
      <span>{contadorClientes}</span>
    </div>
  );
}

export default PacientesNuevos;