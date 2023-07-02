import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function IngresosYRentabilidad(props) {
    const [ingresosTotales, setIngresosTotales] = useState(null);
    const [gastosTotales, setGastosTotales] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "gastos"),
            where("fechaGasto", ">=", props.fechaInicio),
            where("fechaGasto", "<=", props.fechaFin)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let total1 = 0;
            snapshot.forEach((doc) => {
                const subTotal = doc.data().subTotalArticulo;
                total1 += subTotal;
            });
            setGastosTotales(total1);
        });

        const q2 = query(collection(db, "tratamientos"));
        const unsubscribeCobros = onSnapshot(q2, (snapshot) => {
            let total2 = 0;
            snapshot.docs.forEach((doc) => {
                const tratamiento = doc.data();
                const cobrosManuales = tratamiento.cobrosManuales;

                if (cobrosManuales && cobrosManuales.fechaCobro) {
                    cobrosManuales.fechaCobro.forEach((fecha, index) => {
                        if (fecha >= props.fechaInicio && fecha <= props.fechaFin) {
                            const importeAbonado = cobrosManuales.importeAbonado[index] || "";
                            const importe = Number(importeAbonado) || 0;
                            total2 += importe;
                        }
                    });
                }
            });
            setIngresosTotales(total2);
        });


        return () => {
            unsubscribe(); unsubscribeCobros();
        };
    }, [props]);


    return (
        <div>
            <span>
                {ingresosTotales !== null && gastosTotales !== null ? (
                    (ingresosTotales - gastosTotales >= 0 ? "+" : "") + (ingresosTotales - gastosTotales)
                ) : (
                    "0"
                )}
            </span>
        </div>
    );
}

export default IngresosYRentabilidad;