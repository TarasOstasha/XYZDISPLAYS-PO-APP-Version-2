const axios = require('../node_modules/axios/dist/node/axios.cjs')
const xml2js = require('xml2js') // xml parser
const createHttpError = require('http-errors')



// many prod
module.exports.getvendors = async (req, res, next) => {
  try {
  } catch (error) {
    console.log('err')
  }
}

// single vendor
module.exports.getvendorById = async (req, res, next) => {
    
  try {
    const { id } = req.params;
    const { type } = req.query;
    console.log(id);
    const url = `${process.env.VENDORPRODUCT}${id}`
    console.log( url );
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
            //console.log(productJson, 'productJson vendor');
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
    next(error)
  }

}

