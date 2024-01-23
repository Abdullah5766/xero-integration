import React, { useEffect, useState } from "react";
import axios from 'axios';
import './App.css';
import mondaySdk from "monday-sdk-js";
import LandingPage from "./components/LandingPage.js"
import MondayCard from "./components/MondayCard.js"
import Navbar from "./components/Navbar.js"
import FetchInvoices from "./components/FetchInvoices.js"
import CreateColumn from "./components/CreateColumn.js"
import DOMPurify from 'dompurify';
//https://23332f08554e13c5.cdn2.monday.app

function App() {
  const monday = mondaySdk();
  const [isauthorized, setIsAuthorized] = useState(false);
  const [isxeroauthorized, setIsXeroAuthorized] = useState(false);
  const [token, setToken] = useState('');
 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorized = urlParams.get('code');

    if (authorized) {
      const sanitizedAuthorizedCode = DOMPurify.sanitize(authorized);
      axios.get(`https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/callback?code=${sanitizedAuthorizedCode}`)
        .then((response) => {
          const accessToken = response.data.tokenSet.access_token;
          monday.setToken(accessToken);

          if (accessToken) {
            setIsXeroAuthorized(true);
            setToken(accessToken);
          }
        })
        .catch((error) => {
          console.error('Error exchanging code for tokens:', error);
        });
    }

  }, [monday]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      const sanitizedAuthorizedCode = DOMPurify.sanitize(authorizationCode);
      axios.get(`https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/monday-callback?code=${sanitizedAuthorizedCode}`)
        .then((response) => {
          const accessToken = response.data.access_token;
          console.log(accessToken);
          monday.setToken(accessToken);

          if (accessToken) {
            setToken(accessToken);
            setIsAuthorized(true);
          }
        })
        .catch((error) => {
          console.error('Error exchanging code for tokens:', error);
        });
    }
  }, [monday]);


  return (
    <div>
      {isxeroauthorized ? (
        <MondayCard />

      ) : isauthorized ? (
        <>
         <Navbar/>

          <div className="container  d-grid align-items-center" style={{ height: " 60vh" }}>
            <div className="row justify-content-center align-items-center ">
              <div className="col-8 col-md-6 mb-3">
               <FetchInvoices/>
              </div>
              <div className="col-8 col-md-6 mb-3">
               <CreateColumn/>
              </div>
            </div>
          </div>
        </>
      ) : (

        <LandingPage />
      )}
    </div>
  );

};
export default App;
