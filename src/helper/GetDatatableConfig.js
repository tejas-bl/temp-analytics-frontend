export const getDataTableConfig = (rawDataList, columnInfo) => {
    let columns = [];
    try {// CREATING DATASET FOR DATATABLE ACCORDING TO  COLUMN INFO AND RAW DATA GETTING IS PARAMETERS
        columnInfo.map((element) => {
            rawDataList.map((e) => {
                const key = Object.keys(e);
                if (key.includes(element.accessor)) {
                    if (!columns.includes(e)) {
                        columns.push(e);
                    }
                }
            });
        });
        return {
            Dataset: columns,
            columnConfig: columnInfo
        };
    } catch (error) {
        console.log("Error while creating datatable from given data  'Error' : ", error);
    }
}