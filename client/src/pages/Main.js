import {useContext, useEffect, useState} from "react";
import {UserContext} from "./UserContext";
import axios from 'axios';
import mondaySdk from "monday-sdk-js";
import {Navigate} from "react-router-dom";

export default function Main() {
    const {setUserToken,userToken} = useContext(UserContext);
    let columnIDs = [];
    const fetchInvoices = async () => {

        try {
          const response = await fetch(`https://i9j279set4.execute-api.us-east-1.amazonaws.com/prod/invoice`)
          const data = await response.json();
    
          // console.log(data.invoices);
    
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
            try {
              const response = await fetch("https://api.monday.com/v2", {
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `${userToken}`,
                },
                body: JSON.stringify({
                  query: query,
                }),
              })
              const res = await response.json();
              // console.log(res);
            } catch (error) {
              console.error("Error creating invoices", error);
            }
          });
          window.alert('Invoices imported successfully!');
    
        }
        catch (error) {
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
              'Authorization': `${userToken}`,
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
                    'Authorization': `${userToken}`,
                  },
                  body: JSON.stringify({
                    'query': query,
                  }),
                });
                const res = await response.json();
    
                const { id } = res.data.create_column;
                // console.log(`Created column '${columnName}':`, id);
                columnIDs.push({ columnName, id });
    
                createdColumnsCount++;
    
                if (createdColumnsCount === columnsToCreate.length) {
                  window.alert('Columns created successfully.');
                }
              } catch (error) {
                console.error(`Error creating column '${columnName}':`, error);
              }
            } else {
              // console.log(`Column '${columnName}' already exists.`);
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

    </div>
  )
}
