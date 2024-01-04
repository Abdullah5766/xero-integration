import React, { useEffect, useState } from "react";
import axios from 'axios';
import mondaySdk from "monday-sdk-js";
import './App.css';
import main2 from "./images/main2.svg";
import main3 from "./images/main3.svg";
import main7 from "./images/Logo-monday.webp";
//https://23332f08554e13c5.cdn2.monday.app
//http://localhost:3000
function App() {
  const monday = mondaySdk();
  const [isauthorized, setIsAuthorized] = useState(false);
  const [isxeroauthorized, setIsXeroAuthorized] = useState(false);
  const [token, setToken] = useState('');
  let columnIDs = [];

  const HandleXeroLogin = () => {
    
     window.top.location.href = "https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/connect";
     //window.location.href = 'http://localhost:3001/connect';
  }

  const HandleLogin = () => {

    // Redirect users to Monday.com's authorization URL
    window.location.href = "https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/auth";
   // window.location.href = 'http://localhost:3001/auth';
  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorized = urlParams.get('code');

    if (authorized) {
      axios.get(`https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/callback?code=${authorized}`)
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
      axios.get(`https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/monday-callback?code=${authorizationCode}`)
        .then((response) => {
          const accessToken = response.data.access_token;
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

  const fetchInvoices = async () => {

try{
   const response= await fetch(`https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/invoice`)
     const data = await response.json();
     
        console.log(data.invoices);
        
        const Invoices = data.invoices;
    
        Invoices.forEach(async (invoice) => {
          //board_id:1816973150
          const columnValues = [];
          columnIDs.forEach(({ id, columnName }) => {
            columnValues.push(`\\"${id}\\":\\"${invoice[columnName.toLowerCase().replace(/\s/g, '')]}\\"`);
          });

          const columnValuesString = `{${columnValues.join(',')}}`;


          const query = `mutation {
          create_item(
            board_id: 1816973150,
            
            item_name: "Invoices",
           column_values: "${columnValuesString}"
          ) {
            id
          }
        }`;
          try{
        const response = await  fetch("https://api.monday.com/v2", {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `${token}`,
            },
            body: JSON.stringify({
              query: query,
            }),
          })
            const res= await response.json();
            console.log(res);
          } catch (error) {
            console.error("Error creating invoices",error);
          }
        });
        window.alert('Invoices imported successfully!');
      
    }
      catch(error) {
        console.error("Error fetching invoices:", error);
        window.alert('Failed to import invoices. Please try again.');
      };
  };

  const createColumns = async () => {
    const columnsToCreate = ['Invoice Number', 'Reference', 'Status', 'Amount Due'];
    let createdColumnsCount = 0;
    let columnsExist = false;
  
    try {
      const response = await fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({
          query: `
            {
              boards(ids: 1816973150) {
                columns {
                  id
                  title
                }
              }
            }
          `,
        }),
      });
      const res = await response.json();
  
      const existingColumns = res.data.boards[0].columns.map(column => column.title);
  
      for (const columnName of columnsToCreate) {
        if (!existingColumns.includes(columnName)) {
          const query = `
            mutation {
              create_column (
                board_id: 1816973150,
                title: "${columnName}",
                column_type: text
              ) {
                id
              }
            }
          `;
  
          try {
            const response = await fetch("https://api.monday.com/v2", {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
              },
              body: JSON.stringify({
                'query': query,
              }),
            });
            const res = await response.json();
  
            const { id } = res.data.create_column;
            console.log(`Created column '${columnName}':`, id);
            columnIDs.push({ columnName, id });
  
            createdColumnsCount++;
  
            if (createdColumnsCount === columnsToCreate.length) {
              window.alert('All columns created successfully!');
            }
          } catch (error) {
            console.error(`Error creating column '${columnName}':`, error);
          }
        } else {
          console.log(`Column '${columnName}' already exists.`);
          columnsExist = true;
        }
      }
  
      if (columnsExist) {
        window.alert('Columns already exist.');
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
      window.alert('Failed to create columns. Please try again.');
    }
  };
  




  return (
    <div>
      {isxeroauthorized ? (
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
                  
                    <p class="ms-4 text-muted card-text">Authorize Monday.com to seamlessly sync and visualize your project management for a comprehensive workflow overview.</p>
                    <button onClick={HandleLogin} className="ms-4 btn btn-primary">
                      Authorize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      ) : isauthorized ? (
        <>
          <nav class="navbar navbar-expand-md   pt-5 pb-3  mb-5">
            <div class="container-xxl">
              <img
                src="./favicon.ico" 
                alt="Logo"
                className=" me-2" 
              />
              <span class="text-dark fs-4 fw-bold">Xero Integration</span>

              <div
                class="collapse navbar-collapse justify-content-end align-center "
                id="main-nav"
              >
               
              </div>
            </div>
          </nav>

          <div className="container  d-grid align-items-center" style={{ height: " 60vh" }}>
            <div className="row justify-content-center align-items-center ">
              <div className="col-8 col-md-6 mb-3">
                <div class="card justify-content-center align-items-center d-grid border-0 shadow" style={{ width: '18 rem', height: '300px' }}>
                  <div class="card-body ">
                    <h2 class="fw-bold mb-3 card-title ">Fetch your Invoices</h2>
                    <button onClick={fetchInvoices} className=" btn btn-primary">
                      Import Invoices
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-8 col-md-6 mb-3">
                <div class="card justify-content-center align-items-center d-grid border-0 shadow" style={{ width: '18 rem', height: '300px' }}>
                  <div class="card-body ">
                    <h2 class="fw-bold mb-3 card-title ">Create columns on monday</h2>
                    <button onClick={createColumns} className=" btn btn-primary">
                      Create Columns
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>



          
        </>
      ) : (
        <div className="container  d-grid align-items-center" style={{ height: " 80vh" , width :"40 vh"}}>
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

      )}
    </div>
  );

};
export default App;
