import React from 'react';
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children , expectedRole}) {

  const access = localStorage.getItem("access");
    const role = localStorage.getItem("role");

    if (!access) {
      return <Navigate to="/"/>
    }
     if(expectedRole && role !== expectedRole){
      return<Navigate to={`/${role}/dashboard`}/>
     }

 return children;
}
