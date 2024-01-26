import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import DOMPurify from 'dompurify';
import axios from 'axios';
import mondaySdk from "monday-sdk-js";
import main3 from "../images/main3.svg";
import main7 from "../images/Logo-monday.webp";
import {Navigate} from "react-router-dom";

export default function MondayCard() {

    const monday = mondaySdk();
    const {setUserToken,userToken} = useContext(UserContext);
    const [redirect,setRedirect] = useState(false);
   
  
    const HandleLogin = () => {

        const sanitizedRedirectUrl = DOMPurify.sanitize("https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/auth");
        window.location.href = sanitizedRedirectUrl;
    }

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
              
                setUserToken(accessToken);
                setRedirect(true);
              }
            })
            .catch((error) => {
              console.error('Error exchanging code for tokens:', error);
            });
        }
      }, [monday]);

      if (redirect) {
        return <Navigate to={'/main'} />
      }
      

    return (
        <div>
         
            <div className="container mx-auto d-grid align-items-center" style={{ height: " 80vh" }}>
                <div className="row justify-content-center align-items-center">
                    <div class="card border-0 shadow" style={{ width: '750px', height: '300px' }}>
                        <div class="row">
                            <div class="col-4 col-md-4">
                                <img src={main3} class="img-fluid rounded-start" alt="main3" style={{ height: '300px' }} />
                            </div>
                            <div class=" col-6 col-md-8">
                                <div class="card-body ">
                                    <img
                                        src={main7}
                                        alt="Logo"
                                        className=" img-fluid me-2"
                                        style={{ height: '100px', width: '350px' }}
                                    />

                                    <p class="ms-4 text-muted card-text">Authorize monday.com to seamlessly sync and visualize your project management for a comprehensive workflow overview.</p>
                                    <button onClick={HandleLogin} className="ms-4 btn btn-primary">
                                        Authorize
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       
        </div>
    )
}
