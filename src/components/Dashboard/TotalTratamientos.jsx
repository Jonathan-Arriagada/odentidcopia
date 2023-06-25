import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function TotalTratamientos() {
  const [totalAbonado, setTotalAbonado] = useState(0);

  useEffect(() => {
    const calcularTotalAbonado = async () => {
      
        const tratamientosRef = collection(db, "tratamientos");
        const tratamientosSnapshot = await getDocs(tratamientosRef);

        let total = 0;

        tratamientosSnapshot.forEach((doc) => {
          const tratamiento = doc.data();

          if (tratamiento.cobrosManuales && tratamiento.cobrosManuales.importeAbonado) {
            const importeAbonado = Number(tratamiento.cobrosManuales.importeAbonado);
            if (!isNaN(importeAbonado)) {
              total += importeAbonado;
            }
          }
        });
        setTotalAbonado(total);        
    };

    calcularTotalAbonado();
  }, []);

  return (
    <div>
      <span>${totalAbonado}</span>
    </div>
  );
}

export default TotalTratamientos;