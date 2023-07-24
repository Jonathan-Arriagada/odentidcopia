import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function Ingresos(props) {
  const [totalAbonado, setTotalAbonado] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "tratamientos"),
      where("fecha", ">=", props.fechaInicio),
      where("fecha", "<=", props.fechaFin)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.docs.forEach((doc) => {
        const tratamiento = doc.data();
        const cobrosManuales = tratamiento.cobrosManuales;

        if (cobrosManuales && cobrosManuales.fechaCobro) {
          cobrosManuales.fechaCobro.forEach((_, index) => {
            const importeAbonado = cobrosManuales.importeAbonado[index] || "";
            const importe = Number(importeAbonado) || 0;
            total += importe;
          });
        }
      });
      setTotalAbonado(total);
    });


    return () => {
      unsubscribe();
    };
  }, [props]);

  return (
    <div>
      <span>${totalAbonado?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    </div>
  );
}

export default Ingresos;