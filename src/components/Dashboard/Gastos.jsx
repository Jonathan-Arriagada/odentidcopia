import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

function Gastos(props) {
    const [gastosTotales, setGastosTotales] = useState(0);

    useEffect(() => {
        const q = query(collection(db, "gastos"),
            where("fechaGasto", ">=", props.fechaInicio),
            where("fechaGasto", "<=", props.fechaFin)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let total1 = 0;
            snapshot.forEach((doc) => {
                const subTotal = doc.data().subTotalArticulo;
                total1 += subTotal || 0;
            });
            setGastosTotales(total1);
        });

        return () => {
            unsubscribe();
        };
    }, [props]);


    return (
        <div>
            <span>
                {(gastosTotales >= 0 ? "+" : "") + gastosTotales?.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        </div>
    );
}

export default Gastos;