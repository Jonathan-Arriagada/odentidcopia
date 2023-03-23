import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getDoc, updateDoc, doc } from "firebase/firestore"
import { db } from "../firebaseConfig/firebase"

const Edit = () => {
    const [ nombre, setNombre ] = useState("")
    const [ apellido, setApellido ] = useState("")
    const [ idc,setIdc] = useState([])

    const navigate = useNavigate()
    const {id} = useParams()

    const update = async (e) => {
        e.preventDefault()
        const client = doc(db, "clients", id)
        const data = {nombre: nombre, apellido: apellido, idc: idc}
        await updateDoc( client, data)
        navigate("/clients")
    }

    const getClientById = async (id) => {
        const client = await getDoc(doc(db, "clients", id) )
        if(client.exists()){
            setNombre(client.data().nombre)
            setApellido(client.data().apellido)
            setIdc(client.data().idc)
        }else{
            console.log("El producto no existe")
        }
    }

useEffect( () => {
    getClientById(id)
}, [])

  return (
    <div className='container'>
        <div className='row'>
            <div className='col'>
                <h1>Editar Cliente</h1>

                <form onSubmit={update}>
                <div className='mb-3'>
                    <label className='form-label'>Nombre</label>
                    <input 
                    value={nombre}
                    onChange={ (e) => setNombre(e.target.value)}
                    type="text"
                    className='form-control'
                     />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Apellido</label>
                    <input 
                    value={apellido}
                    onChange={ (e) => setApellido(e.target.value)}
                    type="text"
                    className='form-control'
                     />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>IDC</label>
                    <input 
                    value={idc}
                    onChange={ (e) => setIdc(e.target.value)}
                    type="number"
                    className='form-control'
                     />
                </div>
                <button type='submit' className='btn btn-primary'>Editar</button>
                </form>
            </div>

        </div>

    </div>
  )
}

export default Edit