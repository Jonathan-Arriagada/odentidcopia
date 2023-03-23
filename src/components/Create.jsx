import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'

const Create = () => {
    const [ nombre, setNombre ] = useState("")
    const [ apellido, setApellido ] = useState("")
    const [ idc,setIdc] = useState([])
    const navigate = useNavigate()

  const clientsCollection = collection(db, "clients")  

    const store = async (e) => {
        e.preventDefault()
        await addDoc( clientsCollection, { nombre: nombre, apellido: apellido, idc: idc } )
        navigate("/clients")
    }

  return (
    <div className='container'>
        <div className='row'>
            <div className='col'>
                <h1>Crear Cliente</h1>

                <form onSubmit={store}>
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
                <button type='submit' className='btn btn-primary'>Agregar</button>
                </form>
            </div>

        </div>

    </div>
  )
}

export default Create