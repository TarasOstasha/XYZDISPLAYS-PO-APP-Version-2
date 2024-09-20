const _ = require('lodash');
const createHttpError = require('http-errors');
const { Option } = require('../models');

module.exports.saveOption = async (req, res, next) => {
    const { options_id, product_code, price, quantity, is_default } = req.body;
    const newOption = {
        optionId: options_id,
        productCode: product_code,
        price, 
        quantity,
        isDefault: is_default
    }
    try {
        // save to DB
        const createdOption = await Option.create(newOption)   
        if (!createdOption) {
            return next(createHttpError(400, 'Something went wrong'));
          }     
        const preparedOption = _.omit(createdOption.get(), [
            'createdAt',
            'updatedAt',
          ]);
          res.status(201).send({ data: preparedOption, msg: 'successful' });
    } catch (error) {
        next(error);
    } 
}

module.exports.getOptions = async (req, res, next) => {
    try {
        const options = await Option.findAll({
            raw: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
        if(!options) {
            return next(createHttpError(404, 'Option Not Found'));
        }
        res.status(200).send({ data: options });
    } catch (error) {
        next(error);
    }
}

module.exports.getOptionById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const foundOption = await Option.findByPk(id, {
            raw: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });
      
        if (!foundOption) {
        return next(createHttpError(404, 'User not found ):'));
        }
        res.status(200).send({ data: foundOption });
    } catch (error) {
        next(error)
    }
}