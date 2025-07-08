import { Route,Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { useState } from "react";
import PrivateRoute from "./component/PrivateRoute";

function App(){
    const[isLoggedIn,setIsLoggedIn]= useState(false);
    return(
        <div className="w-screen min-h-screen bg-background ">
            <Routes>
                <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/Dashboard" element={
                    <PrivateRoute  isLoggedIn={isLoggedIn}>
                    <Dashboard setIsLoggedIn={setIsLoggedIn} />
                </PrivateRoute>}>
                </Route>
            </Routes>
            
        </div>
    );
}

export default App;