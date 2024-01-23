import React from 'react'

export default function FetchInvoices() {
    const fetchInvoices = async () => {

        try {
            const response = await fetch(`http://localhost:3001/invoice`);
            const data = await response.json();

            const Invoices = data.invoices;

            Invoices.forEach(async (invoice) => {
                const columnValues = [];
                columnIDs.forEach(({ id, columnName }) => {
                    columnValues.push(`\\"${id}\\":\\"${invoice[columnName.toLowerCase().replace(/\s/g, '')]}\\"`);
                });

                const columnValuesString = `{${columnValues.join(',')}}`;

                const query = `mutation {
                create_item(
                  board_id: ${boardId},
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
                            'Authorization': `${token}`,
                        },
                        body: JSON.stringify({
                            query: query,
                        }),
                    });
                    const res = await response.json();
                    console.log(res);
                } catch (error) {
                    console.error("Error creating invoices", error);
                }
            });
            window.alert('Invoices imported successfully!');
        } catch (error) {
            console.error("Error fetching invoices:", error);
            window.alert('Failed to import invoices. Please try again.');
        }

    };
    return (
        <div>
            <div class="card justify-content-center align-items-center d-grid border-0 shadow" style={{ width: '18 rem', height: '300px' }}>
                <div class="card-body ">
                    <h2 class="fw-bold mb-3 card-title ">Fetch your Invoices</h2>
                    <button onClick={fetchInvoices} className=" btn btn-primary">
                        Import Invoices
                    </button>
                </div>
            </div>
        </div>
    )
}
