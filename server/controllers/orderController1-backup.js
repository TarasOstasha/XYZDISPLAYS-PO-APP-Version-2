const axios = require('../node_modules/axios/dist/node/axios.cjs')
const xml2js = require('xml2js') // xml parser
const createHttpError = require('http-errors')
const fs = require('fs')
const ExcelJS = require('exceljs')
//const clipboardy = require('clipboardy')
const { exec } = require('child_process')
const outlook = require('node-outlook')
const nodemailer = require('nodemailer')

// many orders
module.exports.getOrders = async (req, res, next) => {
  try {
  } catch (error) {
    console.log('err')
  }
}

// single order
module.exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(id)
    const url = `${process.env.URL}${id}`
    //const url = `${process.env.URL}32424`;
    //const url = 'https://jsonplaceholder.typicode.com/users';

    // Make the GET request
    axios
      .get(url)
      .then((response) => {
        // Handle successful response
        //console.log('Response data:', response.data);
        const xmlData = response.data
        const parser = new xml2js.Parser()
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err)
          } else {
            const orderJson = JSON.stringify(result, null, 2)
            //console.log(orderJson, '>> orderJson')
            res.status(200).send(orderJson)
          }
        })
      })
      .catch((error) => {
        // Handle error
        if (error.response) {
          createHttpError(
            error.response.status,
            'Server responded with a non-2xx status',
          )
          //console.error('Server responded with a non-2xx status:', error.response.status);
          //console.error('Response data:', error.response.data);
        } else if (error.request) {
          createHttpError(504, 'No response received from the server')
          //console.error('No response received from the server:', error.request);
        } else {
          createHttpError(404, 'Not Found')
          //console.error('Error setting up the request:', error.message);
        }
      })
    //res.status(200).send('hello wordl');
  } catch (error) {
    //console.log('err');
    next(error)
  }
}

module.exports.saveOrder = async (req, res, next) => {
  try {
    const {
      po,
      date,
      inHand,
      shipTo,
      vendorAddress,
      ship,
      shipInfoDescription,
      productTableData,
      vendorEmails,
      orderNotes,
    } = req.body // general data
    //console.log(req.body, '<< PO');
    const to = `${vendorEmails.join(',')}` //'recipient@example.com'
    const subject = `xyzDisplays // Purchase Order ${po} `
    const inHandDate = inHand.split('T')[0];
    const borderColor = {
      top: { style: 'medium', color: { argb: '000000' } }, // Black color
      left: { style: 'medium', color: { argb: '000000' } }, // Black color
      bottom: { style: 'medium', color: { argb: '000000' } }, // Black color
      right: { style: 'medium', color: { argb: '000000' } }, // Black color
    }

    const orderContent = productTableData.map((p) => {
      return `
      Order Number - ${po}\n
      Order date - ${date}\n
      Order InHand - ${inHand}\n
      Ship To - ${shipTo}\n
      Vendor Address - ${vendorAddress}\n
      Ship - ${ship}\n
      shipInfoDescription - ${shipInfoDescription}\n
      ____________________________________________
      ProductCode - ${p.ProductCode}\n
      VendorCode - ${p.Vendor_PartNo}\n
      ProductName - ${p.ProductName}\n 
      Quantity - ${p.Quantity}\n
      Vendor_Price - ${p.Vendor_Price}
      ProductPrice = ${p.ProductPrice}
      TotalPrice - ${p.TotalPrice}
    `
    })

    const testtable = `
      <table>
        <tbody>
            <tr>
                <td>
                    Lumiere Light Wall
                </td>
            </tr>
            <tr>
                <td style="text-align: left;">
                    Counter (include front & back)
                </td>
            </tr>
        </tbody>
      </table>
    `;


    // console.log(productTableData, '<< productTableData')
    //const encodedHTMLContent = encodeURIComponent(`${orderContent}, ${orderProductContent}`)

    //const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(subject)}`; // add signatere
    //const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodedHTMLContent}`
    const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(testtable)}`

    // const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(subject)}`

    exec(`start "" "${mailtoURI}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    })

    // Sample table data
    const tableData = [
      ['', '', '', '', '', ''],
      ['PURCHASE ORDER', '', '', '', '', ''],
      // ['', '', '', '', '', ''],
      ['Customer', '', '', '', 'P.O. #: ', po],
      // ['','','','','',''],
      [
        // {
        //   richText: [
        //     { text: 'xyzDisplays', font: { bold: true } },
        //     { text: '\n', font: {} },
        //     { text: '170 Changebridge Rd. Bldg A7', font: {} },
        //     { text: '\n', font: {} },
        //     { text: 'Montville, NJ 07045', font: {} },
        //     { text: '\n', font: {} },
        //     { text: '973-515-5151', font: {} },
        //     { text: '\n', font: {} },
        //     { text: 'sales@xyzDisplays.com', font: {} },
        //   ],
        // },
        '',
        '',
        '',
        '',
        'Date: ',
        'date',
      ],
      ['', '', '', '', 'Ship Info: ', ship],
      ['', '', '', '', '', shipInfoDescription],
      ['', '', '', '', 'In Hand\nDate: ', inHandDate],
      ['Vendor', '', '', '', 'Ship To', ''],
      [
        {
          richText: [{ text: vendorAddress, font: {} }],
        },
        '',
        '',
        '',
        '',
        {
          richText: [{ text: shipTo, font: {} }],
        },
      ],
      ['Order Notes:', '', '', '', '', ''],
      [orderNotes, '', '', '', '', ''],
      [
        'Item',
        'Description',
        'Qty',
        'Cost per Unit (USD)',
        'Discounted Cost per Unit (USD)',
        'Amount (USD)',
      ],
      // Add more rows as needed
    ]

    const productData = productTableData.map((p) => {
      return [
        `${p.ProductCode}`,
        `${p.ProductName}`,
        `${p.Quantity}`,
        `${p.Vendor_Price}`,
        `${p.ProductPrice}`,
        `${p.TotalPrice}`,
      ]
    })
    //console.log(productData);
    const updatedTable = [...tableData, ...productData]
    console.log(updatedTable)
    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    // Set the value of each cell in the worksheet and apply formatting
    updatedTable.forEach((row, rowIndex) => {
      row.forEach((cellData, columnIndex) => {
        const cell = worksheet.getCell(rowIndex + 1, columnIndex + 1)
        if (typeof cellData === 'object' && cellData.richText) {
          cell.value = {
            richText: cellData.richText.map((text) => ({
              text: text.text,
              font: text.font || {},
            })),
          }
        } else {
          cell.value = cellData
        }

        // Apply formatting for specific cells
        if (rowIndex === 1) {
          cell.font = { bold: true, size: 11, name: 'Times New Roman' } // PURCHASE ORDER
        } else if (
          (rowIndex === 2 && columnIndex === 0) ||
          (rowIndex === 2 && columnIndex === 4) ||
          (rowIndex === 4 && columnIndex === 4) ||
          (rowIndex === 3 && columnIndex === 4) ||
          (rowIndex === 7 && columnIndex === 0) ||
          (rowIndex === 7 && columnIndex === 5)
        ) {
          // Customer and Vendor
          cell.font = { bold: true, size: 12, name: 'Times New Roman' }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCCCCC' },
          } // Grey background
        } else if (rowIndex === 4 && columnIndex === 1) {
          cell.font = { size: 12, name: 'Times New Roman' }
        } else if (
          (rowIndex === 6 && columnIndex === 4) ||
          (rowIndex === 6 && columnIndex === 5)
        ) {
          cell.font = { bold: true, size: 12, name: 'Times New Roman' }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          },
          cell.border = borderColor
        } else if (rowIndex === 11) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCCCCC' },
          }
          cell.font = { bold: true, size: 12, name: 'Times New Roman' }
        }
        {
        }
      })
    })

    // CUSTOMER
    worksheet.mergeCells('A4:A7')
    worksheet.getColumn('A').width = 25
    worksheet.getCell('A4').value =
      'xyzDisplays\n 170 Changebridge Rd. Bldg A7\n Montville, NJ 07045\n 973-515-5151\n sales@xyzDisplays.com';
    worksheet.getCell('A4').border = borderColor;
    worksheet.getCell('A3').border = borderColor;   
    worksheet.getCell('A8').border = borderColor;  
    worksheet.getCell('A9').border = borderColor;  
    worksheet.getCell('E3').border = borderColor;
    worksheet.getCell('E4').border = borderColor;
    worksheet.getCell('E5').border = borderColor;
    worksheet.getCell('E9').border = borderColor;
    worksheet.getCell('F3').border = borderColor;
    worksheet.getCell('F4').border = borderColor;
    worksheet.getCell('F5').border = borderColor;
    // Ship Info Bottom
    worksheet.mergeCells('E6:F6')
    worksheet.getCell('E6').value = shipInfoDescription
    worksheet.getRow(6).height = 35
    worksheet.getColumn(5).width = 15
    worksheet.getColumn(6).width = 25

    // shippInfo bottom
    const shipInfoBottom = worksheet.getCell('E6')
    shipInfoBottom.font = {
      color: { argb: 'FF0000' }, // Red text color
    }
    shipInfoBottom.border = borderColor

    // Vendor and ShipTo
    worksheet.getRow(9).height = 65
    worksheet.mergeCells('E8:F8')
    worksheet.mergeCells('E9:F9')
    worksheet.getCell('E9').value = shipTo
    const shipToCell = worksheet.getCell('E8')
    shipToCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCCCCC' },
    }
    shipToCell.font = { bold: true, size: 12, name: 'Times New Roman' }
    shipToCell.border = borderColor

    // Order Notes
    worksheet.mergeCells('A10:F10')
    const orderNotesCell = worksheet.getCell('A10')
    orderNotesCell.font = { bold: true, size: 14, name: 'Times New Roman' }
    orderNotesCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD700' },
    }
    orderNotesCell.border = borderColor
    worksheet.mergeCells('A11:F11')
    worksheet.getCell('A11').value = orderNotes
    worksheet.getRow(11).height = 50

    // PRODUCTS
    worksheet.getCell('A12').border = borderColor;
    worksheet.getCell('B12').border = borderColor;
    worksheet.getCell('C12').border = borderColor;
    worksheet.getCell('D12').border = borderColor;
    worksheet.getCell('E12').border = borderColor;
    worksheet.getCell('F12').border = borderColor;
    // Save the workbook to a file
    workbook.xlsx
      .writeFile(`order-${po}.xlsx`)
      .then(() => {
        console.log('Excel file created successfully')

        // Open the saved Excel file
        exec(`start order-${po}.xlsx`, (error, stdout, stderr) => {
          if (error) {
            console.error('Error opening Excel file:', error)
            return
          }
          console.log('Excel file opened successfully')
        })
      })
      .catch((error) => {
        console.error('Error creating Excel file:', error)
      })

    //console.log('should open outlook')
    res.status(201).send('Success')
  } catch (error) {
    next(error)
  }
}
