const axios = require('../node_modules/axios/dist/node/axios.cjs')
const xml2js = require('xml2js') // xml parser
const createHttpError = require('http-errors')

//const clipboardy = require('clipboardy')
const { exec } = require('child_process')
const outlook = require('node-outlook')
const nodemailer = require('nodemailer')

// many prod
module.exports.getProducts = async (req, res, next) => {
  try {
  } catch (error) {
    console.log('err')
  }
}

// single prod
module.exports.getProductById = async (req, res, next) => {
    // console.log('getProductById router***');
  try {
    const { id } = req.params;
    const { type } = req.query;
    //let url;
    const url = `${process.env.PRODUCT}${id}`
    // if (type === 'product') {
    //   url = `${process.env.PRODUCT}${id}`;
    // } else if (type === 'vendor') {
    //   url = `${process.env.VENDORPRODUCT}${id}`;
    // } else {
    //   return res.status(400).send({ error: 'Invalid type parameter' });
    // }
    axios
      .get(url)
      .then((response) => {
        const xmlData = response.data
        const parser = new xml2js.Parser()
        parser.parseString(xmlData, (err, result) => {
          if (err) {
            console.error('Error parsing XML:', err)
          } else {
            const productJson = JSON.stringify(result, null, 2)
            res.status(200).send(productJson)
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
        } else if (error.request) {
          createHttpError(504, 'No response received from the server')
          //console.error('No response received from the server:', error.request);
        } else {
          createHttpError(404, 'Not Found')
        }
      })
  } catch (error) {
    //console.log('err');
    next(error)
  }
}



