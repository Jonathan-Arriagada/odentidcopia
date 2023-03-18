import React from 'react';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { collection, getDocs, getDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig/firebase';
import { SweetAlert2 } from 'sweetalert2-react-content';
import withReactContent from 'sweetalert2-react-content';

// const mySwal = withReactContent(Swal)

const Show = () => {

    const [clients,setClients] = useState([])

    const clientsCollection =  collection(db, "clients")

    const getClients = async () => {
        const data = await getDocs(clientsCollection)
        setClients(
            data.docs.map ( (doc) => ( {...doc.data(),id:doc.id}))
        )
    }

    const deleteClient = async (id) => {
       const clientDoc = doc(db, "clients", id)
       await deleteDoc(clientDoc)
       getClients()
    }

    useEffect( () => {
        getClients()
    }, [])
  return (
    <>
    <div className='container'>
        <div className='row'>
            <div className='col'>
                <div className='d-grid gap-2'>
                    <Link to="/create" className='btn btn-secondary mt-2 mb-2' >Agregar cliente</Link>
                </div>
                <table className='table table-dark table-hover'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>IDC</th>
                            <th>Accion</th>
                        </tr>
                    </thead>

                    <tbody>
                        {clients.map( (client) => (
                            <tr key={client.id}>
                                <td> {client.nombre} </td>
                                <td> {client.apellido} </td>
                                <td> {client.idc} </td>
                                <td>
                                    <Link to={`/edit/${client.id}`} className="btn btn-success m-1"> <i className="fa-regular fa-pen-to-square"></i> </Link>
                                    <button onClick={ () => {deleteClient(client.id)}} className="btn btn-danger"> <i className="fa-solid fa-trash-can"></i> </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
    </>
  )
}

export default Show