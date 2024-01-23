import React from 'react'

export default function CreateColumn() {
    let columnIDs = [];

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
                  boards(ids: ${boardId}) {
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
                    board_id: ${boardId},
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
            <div class="card justify-content-center align-items-center d-grid border-0 shadow" style={{ width: '18 rem', height: '300px' }}>
                <div class="card-body ">
                    <h2 class="fw-bold mb-3 card-title ">Create columns on monday</h2>
                    <button onClick={createColumns} className=" btn btn-primary">
                        Create Columns
                    </button>
                </div>
            </div>
        </div>
    )
}
