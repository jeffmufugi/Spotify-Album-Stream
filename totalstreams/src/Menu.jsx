
import React from "react"
import { useState, useEffect, useRef } from "react"
import m1 from "./assets/Home.svg";
import m2 from "./assets/Search2.svg";
import m3 from "./assets/Menu.svg";
import { useNavigate,useLocation } from "react-router-dom";

export default function MenuBar(){
    const navigate = useNavigate();
    const homepage = () => {
      
        navigate(`/`); // Pass artist ID as a query parameter

      };
      const searchpage = () => {
        
        navigate(`/search`); // Pass artist ID as a query parameter
        
      };
      const albumpage = () => {
        navigate(`/album`); // Pass artist ID as a query parameter
      };
    return(
        <>

        <div className="menu-bar">
            
            <div className="menu-icon" >
                <img src={m1} alt="" onClick={homepage}/>
            </div>
            
            <div className="menu-icon" >
            <img src={m2} alt="" onClick={searchpage}/>

            </div>
            
            {/* <div className="menu-icon" >
            <img src={m3} alt="" onClick={albumpage}/>

            </div> */}

        </div>
        
        </>
    )
}