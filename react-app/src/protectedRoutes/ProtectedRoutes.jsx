import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({children}) => {
    const {isAuthenticated} = useContext(AuthContext)

    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedRoutes
