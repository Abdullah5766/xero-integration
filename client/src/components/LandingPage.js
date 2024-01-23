import React from 'react';
import main2 from "../images/main2.svg";
import DOMPurify from 'dompurify';
export default function LandingPage() {


    const HandleXeroLogin = () => {

        const sanitizedRedirectUrl = DOMPurify.sanitize("https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/connect");
    window.top.location.href = sanitizedRedirectUrl;
    }

    return (
        <div>
            <div className="container  d-grid align-items-center" style={{ height: " 80vh", width: "40 vh" }}>
                <div className="row justify-content-start align-items-center">
                    <div className=" col-6 col-md-5 mb-5 mb-lg-0">
                        <h1 className="my-5 display-3 fw-bold ls-tight">
                            Elevate Your <br />
                            Business <br />
                            <span className="text-primary">
                                with Xero Integration
                            </span>
                        </h1>
                        <p className="lead text-muted fw-bold">
                            Welcome to our Xero integration app! Connect your Xero
                            account to access and view your business workflow directly
                            on your boards. With our app, you can retrieve, organize,
                            and track your business details in one place, making it
                            simple to stay on top of your finances.
                        </p>
                        <button onClick={HandleXeroLogin} className="btn btn-primary">
                            Connect to Your Xero Account
                        </button>
                    </div>
                    <div className="d-none d-md-block col-md-4 mb-4 mb-lg-0 ">
                        <img
                            src={main2}
                            alt="main"
                            className=" me-2"
                        />
                    </div>

                </div>
            </div>
        </div>
    )
}
