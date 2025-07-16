const moment = require('moment')

const { fileExtractData, convertJSONtoXLS } = require("./util/fileDataExtracter");


const allData = fileExtractData('./import/BATCH.xlsx');

const collatralData = fileExtractData('./import/CM.xlsx');


const uniqueAccountIds = [...new Set(allData.map(item => item.AccountID))];


// 80percenter and 25percent
const newCalculateReport = uniqueAccountIds.map(acccountsId => {

    let totalValue = 0;

    allData.map(data => {

        if (data.AccountID === acccountsId) {
            totalValue = data.Value + totalValue
        }

    })

    return (
        {
            AccountID: acccountsId,
            Total: totalValue,
            Per80: totalValue * 0.70,
            Per25: totalValue * 0.30
        }
    )
})

console.log(newCalculateReport)


// collatral data
// console.log(collatralData)

const filteredColactral = collatralData.filter(data => data['Cash allocated (b)']);

// get the clientCodeBaseCollateral 

const clientBasedCllacteral = uniqueAccountIds.map((data) => filteredColactral.filter(colData => data === colData['Client Code'])[0] || {
    'CM code': 0,
    'TM/CP code': 0,
    'Client Code': data,
    'Minimum Margins (a)': 0,
    'Cash allocated (b)': 0,
    'Cash-Others (c)': 0,
    'Non-cash Securities (d)': 0,
    'Short allocation Max [a-(b+c+d)': 0
})



let finalReport = []

newCalculateReport.map(data => {

    clientBasedCllacteral.map(colat => {


        if (data.AccountID === colat['Client Code'] && data.Total < 500000) {
            // console.log(colat, data)
            finalReport.push({
                "AccountID": data.AccountID,
                "Total": data.Total,
                "Per80": data.Per80,
                "Per25": data.Per25,
                'CM code': colat['CM code'] || 0,
                'TM/CP code': colat['TM/CP code'] || 0,
                'Client Code': colat['Client Code'],
                'Minimum Margins (a)': colat['Minimum Margins (a)'] || 0,
                'Cash allocated (b)': colat['Cash allocated (b)'] || 0,
                'Cash-Others (c)': colat['Cash-Others (c)'] || 0,
                'Non-cash Securities (d)': colat['Non-cash Securities (d)'] || 0,
                'Short allocation Max [a-(b+c+d)': colat['Short allocation Max [a-(b+c+d)'] || 0
            })
            // return {
            //     "AccountID": data.AccountID,
            //     "Total": data.Total,
            //     "Per80":  data.Per80,
            //     "Per25": data.Per25,
            //     'CM code': colat['CM code'] || 0,
            //     'TM/CP code': colat['TM/CP code'] || 0,
            //     'Client Code': colat['Client Code'],
            //     'Minimum Margins (a)': colat['Minimum Margins (a)'] || 0,
            //     'Cash allocated (b)': colat['Cash allocated (b)'] || 0,
            //     'Cash-Others (c)': colat['Cash-Others (c)'] || 0,
            //     'Non-cash Securities (d)': colat['Non-cash Securities (d)'] || 0,
            //     'Short allocation Max [a-(b+c+d)': colat['Short allocation Max [a-(b+c+d)'] || 0
            // }

        }
    })


})

convertJSONtoXLS("AllDataReport", finalReport)

convertJSONtoXLS("CTCL", finalReport.map(data => ({
    AccountID: data.AccountID,
    Total: data.Per80
})))

convertJSONtoXLS("UPLOAD", finalReport.map(data => ({
    Date: moment(new Date).format('DD-MMM-yyyy'),
    CM: "CM",
    BCODE: 13336,
    BCODE1: 13336,
    BLANK: "",
    CLIENTTCODE: data.AccountID,
    CREDIT: 'C',
    Per25: data.Per25 + data['Cash allocated (b)'],
    BLANK_1: "",
    BLANK_2: "",
    BLANK_3: "",
    BLANK_4: "",
    BLANK_5: "",
    BLANK_6: "",
    CREDITNUM: "U"
})))
// console.log(finalReport)


