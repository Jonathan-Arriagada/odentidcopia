import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function TotalTratamientos(PROPS) {
  const [totalAbonado, setTotalAbonado] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "tratamientos"));
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
  }, []);

  return (
    <div>
      <span>${totalAbonado}</span>
    </div>
  );
}

export default TotalTratamientos;