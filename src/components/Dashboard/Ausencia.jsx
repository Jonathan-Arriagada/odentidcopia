import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function Ausencia() {
  const [, setTotalCitas] = useState(0);
  const [, setCitasCanceladas] = useState(0);
  const [porcentajeCanceladas, setPorcentajeCanceladas] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "citas"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let canceladas = 0;

      snapshot.forEach((doc) => {
        const cita = doc.data();
        total++;

        if (cita.estado === "Cancelada") {
          canceladas++;
        }
      });

      setTotalCitas(total);
      setCitasCanceladas(canceladas);
      calcularPorcentaje(canceladas, total);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const calcularPorcentaje = (canceladas, total) => {
    if (total > 0) {
      const porcentaje = (canceladas / total) * 100;
      setPorcentajeCanceladas(porcentaje.toFixed(2));
    } else {
      setPorcentajeCanceladas(0);
    }
  };

  return (
    <div>
      <span>{porcentajeCanceladas}%</span>
    </div>
  );
}

export default Ausencia;