const {check, validationResult} = require('express-validator');

const validateCreateBand = [
    check('name')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Name can not be empty!')
      .isLength({min:1}),
    check('from')
      .trim()
      .not()
      .isEmpty()
      .withMessage('From can not be empty!')
      .isLength({min: 2})
      .withMessage('Minimum 2 characters required!'),
    check('founded')
      .trim()
      .isNumeric()
      .withMessage('Founded must be a number!')
      .isLength({min: 4})
      .withMessage('Minimum 4 numbers required!'),
    check('albums')
      .trim()
      .isNumeric()
      .withMessage('Albums must be a number!')
      .not()
      .isEmpty()
      .withMessage('Albums can not be empty!'),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
      next();
    },
  ];

  module.exports = {
    validateCreateBand
};