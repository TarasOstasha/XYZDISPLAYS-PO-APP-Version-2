const axios = require('../node_modules/axios/dist/node/axios.cjs')
const xml2js = require('xml2js') // xml parser
const createHttpError = require('http-errors')
const path = require('path')
const fs = require('fs')
const ExcelJS = require('exceljs')
//const clipboardy = require('clipboardy')
// const edge = require('edge-js');
const { exec } = require('child_process')
const outlook = require('node-outlook')
const nodemailer = require('nodemailer')
const os = require('os');
const { emailTemplate } = require('./email/emailTemplate');
const { orderData } = require('./email/orderData');


module.exports.getOrders = async (req, res, next) => {
  try {
    console.log(req.body);
    res.status(201).send('Success')
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

// module.exports.saveOrder = async (req, res, next) => {
//   try {
//     const {
//       po,
//       date,
//       inHand,
//       shipTo,
//       vendorAddress,
//       ship,
//       shipInfoDescription,
//       productTableData,
//       vendorEmails,
//       orderNotes,
//     } = req.body // general data
//     console.log(req.body.productTableData, '<< req.body');
//     console.log(productTableData.length, '<< productTableData lenght');

//     // if(productTableData[0].length >=2) {
//     //   const orderData = productTableData[0].map((p, index) => {
//     //     console.log(p, '<< p');
        
        
//     //   })
//     // }  
//     //   res.status(201).send('Success')
//     // }
//     // console.log(productTableData.length, '<< productTableData');
//     //const parsedInHandDate = new Date(inHand);
//     //const formattedInHandDate = `${parsedInHandDate.getFullYear()}-${(parsedInHandDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedInHandDate.getDate().toString().padStart(2, '0')}`;
//     // Construct the mailtoURI
//     // const to = `${vendorEmails.join(',')}` //'recipient@example.com'
//     // const subject = `xyzDisplays // Purchase Order ${po} `
//     // const inHandDate = inHand.split('T')[0];
    
//     // const vendorAddressPO = vendorAddress.map(w)
//     // console.log(vendorAddress, '<< vendorAddress');
//     const orderContent = productTableData.map((p) => {
//       return `
//       Order Number - ${po}\n
//       Order date - ${date}\n
//       Order InHand - ${inHand}\n
//       Ship To - ${shipTo}\n
//       Vendor Address - ${vendorAddress}\n
//       Ship - ${ship}\n
//       shipInfoDescription - ${shipInfoDescription}\n
//       ____________________________________________
//       ProductCode - ${p.ProductCode}\n
//       VendorCode - ${p.Vendor_PartNo}\n
//       ProductName - ${p.ProductName}\n 
//       Quantity - ${p.Quantity}\n
//       Vendor_Price - ${p.Vendor_Price}
//       ProductPrice = ${p.ProductPrice}
//       TotalPrice - ${p.TotalPrice}
//     `
//     })
//     //console.log(productTableData, '<< productTableData');
//     const orderData = productTableData.map((p, index) => {
//       const vendorPriceBeforeDiscount = parseFloat(p.Vendor_Price[index]).toFixed(2);
//       const vendorPriceAfterDiscount = parseFloat(vendorPriceBeforeDiscount * p.discount[index]).toFixed(2);
//       const totalAmountAfterDiscount = vendorPriceAfterDiscount * p.Quantity[index];
//       const totalAmountBeforeDiscount = parseFloat(p.Quantity[index] * p.Vendor_Price[index]).toFixed(2);
//       const totalAmount = parseFloat(p.Quantity * (p.Vendor_Price * p.discount)).toFixed(2);
//       console.log(p, '<< p');
//       return `
//         <table style="width: 100%;border: 2px solid;">
//           <tbody>
//               <tr>
//                   <td style="font-weight: bold;">Item</td>
//                   <td style="font-weight: bold;">Description</td>
//                   <td style="font-weight: bold;">Qty</td>
//                   <td style="text-align: center;font-weight: bold;">Cost per <br> Unit <br> (USD)</td>
//                   <td style="text-align: center;font-weight: bold;">Discounted <br> Cost per <br> Unit (USD)</td>
//                   <td style="text-align: center;font-weight: bold;">Total Before <br> Discount</td>
//                   <td style="text-align: center;font-weight: bold;">Total After <br> Discount</td>
//               </tr>
//               <tr style="border: 1px solid;">
//                   <td style="border-top: 1px solid;">${p.Vendor_PartNo}</td>
//                   <td style="border-top: 1px solid;">${p.ProductName}</td>
//                   <td style="border-top: 1px solid;text-align:center;">${p.Quantity}</td>
//                   <td style="border-top: 1px solid;text-align:center;">$${vendorPriceBeforeDiscount}</td>
//                   <td style="border-top: 1px solid;text-align:center;">$${vendorPriceAfterDiscount}</td>
//                   <td style="border-top: 1px solid;text-align:center;">$${totalAmountBeforeDiscount}</td>
//                   <td style="border-top: 1px solid;text-align:center;">$${totalAmountAfterDiscount}</td>
//               </tr>
//           </tbody>
//         </table>
//         <table style="width: 100%;border: 2px solid;">
//           <tbody>
//               <td style="width:800px"></td>
//               <td style="font-weight:bold;">Total Amount: </td>
//               <td style="font-weight:bold;">$${totalAmount}</td>
//           </tbody>
//         </table>
//       `
//     })

//     // Define the HTML table content
  //   const emailTemplateTable = `
  //   <table>
  //   <tr>
  //     <td>
  //       <!-- first table : BEGIN -->
  //       <table>
  //           <tbody>
  //               <tr>
  //                   <td style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;">Customer</td>
  //                   <td style="width: 220px;"></td>
    
  //               </tr>
  //               <tr>
  //                   <td style="border: 2px solid;">
  //                       xyzDisplays <br>
  //                       170 Changebridge Rd. Bldg A7 <br>
  //                       Montville, NJ 07045 <br>
  //                       973-515-5151 <br>
  //                       sales@xyzDisplays.com <br>
  //                   </td>
  //               <tr>
  //                   <td style="height: 24px;"></td>
  //               </tr>
  //               <tr>
  //                   <td style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;">Vendor</td>
  //               </tr>
  //               <tr>
  //                   <td style="border: 2px solid;">
  //                       ${vendorAddress}
  //                   </td>
  //               </tr>
  //           </tbody>
  //       </table>
  //       <!-- first table : END -->
  //     </td>
  //     <td>
  //       <!-- second table : BEGIN -->
  //       <table>
  //           <tbody>
  //               <tr>
  //                   <td style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;">P.O. #:</td>
  //                   <td style="font-weight:bold;border: 2px solid;">${po}</td>
  //               </tr>
  //               <tr>
  //                   <td style="background:rgb(148, 146, 141);border: 2px solid;font-weight:bold">Date:</td>
  //                   <td style="border: 2px solid;">${date}</td>
  //               </tr>
  //               <tr>
  //                   <td style="background:rgb(148, 146, 141);border: 2px solid;font-weight:bold">Ship Info:</td>
  //                   <td style="border: 2px solid;">${ship}</td>
  //               </tr>
  //               <tr>
  //                   <td colspan="2" style="color: brown;text-align: center;border: 2px solid;">
  //                       ${shipInfoDescription}
  //                   </td>
  //               </tr>
  //               <tr style="background: yellow;height: 46px;">
  //                   <td style="border: 2px solid;font-weight:bold">In Hand Date: </td>
  //                   <td style="border: 2px solid;">${inHand}</td>
  //               </tr>
  //               <tr>
  //                   <td colspan="2" style="background:rgb(148, 146, 141);font-weight:bold;border: 2px solid;"> Ship to</td>
  //               </tr>
  //               <tr>
  //                   <td colspan="2" style="border: 2px solid;">
  //                       ${shipTo}
  //                   </td>
  //               </tr>
  //           </tbody>
  //       </table>
  //       <!-- second table : END -->
  //     </td>
  //   </tr>
  // </table>
  // <table style="width: 100%;">
  //   <tbody>
  //       <tr>
  //           <td style="border: 2px solid;background: rgb(223, 166, 10);font-weight: bold;border: 2px solid;">Order Notes:</td>
  //       </tr>
  //       <tr>
  //           <td style="border: 2px solid;height: 55px;border: 2px solid;">${orderNotes}</td>
  //       </tr>
  //   </tbody>
  // </table>

  //   `;

//     // Define email content
//     const to = vendorEmails.join(',');
//     const subject = `xyzDisplays // Purchase Order ${po}`;
//     const htmlContent = `
//       <html>
//         <body>
//           <strong>PURCHASE ORDER</strong><br><br>
//           ${emailTemplateTable}
//           ${orderData}
//         </body>
//       </html>
//     `;

//     // console.log(productTableData, '<< productTableData')
//     //const encodedHTMLContent = encodeURIComponent(`${orderContent}, ${orderProductContent}`)

//     //const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(subject)}`; // add signatere
//     //const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodedHTMLContent}`
//     // const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(
//     //   subject,
//     // )}&body=${encodeURIComponent(testtable)}`

//     // Write the HTML content to a temporary file
//     const tmpHtmlFilePath = path.join(os.tmpdir(), 'emailContent.html');
//     fs.writeFileSync(tmpHtmlFilePath, htmlContent, 'utf8');

//     // Path to the PowerShell script
//     const scriptPath = path.join(__dirname, 'createEmail.ps1');

//     // Command to execute the PowerShell script
//     const command = `powershell -File "${scriptPath}" -htmlFilePath "${tmpHtmlFilePath}" -to "${to}" -subject "${subject}"`;

//     // Execute the PowerShell script
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${error.message}`);
//         return;
//       }
//       if (stderr) {
//         console.error(`stderr: ${stderr}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//     });

//     // const mailtoURI = `mailto:${to}?subject=${encodeURIComponent(subject)}`

//     // Open the default email client with the mailtoURI
//     // exec(`start "" "${mailtoURI}"`, (error, stdout, stderr) => {
//     //   if (error) {
//     //     console.error(`Error: ${error.message}`)
//     //     return
//     //   }
//     //   if (stderr) {
//     //     console.error(`stderr: ${stderr}`)
//     //     return
//     //   }
//     //   console.log(`stdout: ${stdout}`)
//     // })

//     //console.log('should open outlook')
//     res.status(201).send('Success')
  
//   } catch (error) {
//     next(error)
//   }
// }


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

    // console.log(req.body, '<< req.body');
    // console.log(vendorEmails, '<< vendorEmails');
  
    const orderDataTable = orderData(productTableData);
    const emailTemplateTable = emailTemplate(vendorAddress, po, date, ship, shipInfoDescription, inHand, shipTo, orderNotes);
    
    // Define email content
    const to = vendorEmails.join(';');
    const subject = `xyzDisplays // Purchase Order ${po}`;
    const htmlContent = `
      <html>
        <body>
          <strong>PURCHASE ORDER</strong><br><br>
          ${emailTemplateTable}
          ${orderDataTable}
        </body>
      </html>
    `;
    // Write the HTML content to a temporary file
    const tmpHtmlFilePath = path.join(os.tmpdir(), 'emailContent.html');
    fs.writeFileSync(tmpHtmlFilePath, htmlContent, 'utf8');

    // Path to the PowerShell script
    const scriptPath = path.join(__dirname, 'createEmail.ps1');

    // Command to execute the PowerShell script
    const command = `powershell -File "${scriptPath}" -htmlFilePath "${tmpHtmlFilePath}" -to "${to}" -subject "${subject}"`;

    //Execute the PowerShell script
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });

    res.status(201).send('Success');
  } catch (error) {
    console.log('err', error)
  }
}