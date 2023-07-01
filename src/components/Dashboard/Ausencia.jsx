import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function Ausencia(props) {
  const [porcentajeCanceladas, setPorcentajeCanceladas] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "citas"),
      where("fecha", ">=", props.fechaInicio),
      where("fecha", "<=", props.fechaFin)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = snapshot.size || 0;
      let canceladas = snapshot.docs.filter((doc) => doc.data().estado === "Cancelada").length;

      calcularPorcentaje(canceladas, total);
    });

    return () => {
      unsubscribe();
    };
  }, [props]);

  const calcularPorcentaje = (canceladas, total) => {
    const porcentaje = total > 0 ? (canceladas / total) * 100 : 0;
    setPorcentajeCanceladas(porcentaje.toFixed(2));
  };

  return (
    <div>
      <span>{porcentajeCanceladas}%</span>
    </div>
  );
}

export default Ausencia;