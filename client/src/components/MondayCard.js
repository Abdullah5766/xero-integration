import React from 'react';
import main3 from "../images/main3.svg";
import main7 from "../images/Logo-monday.webp";
import DOMPurify from 'dompurify';

export default function MondayCard() {
   

    const HandleLogin = () => {

        const sanitizedRedirectUrl = DOMPurify.sanitize("https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/auth");
        window.location.href = sanitizedRedirectUrl;
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
