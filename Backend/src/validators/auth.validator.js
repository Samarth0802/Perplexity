import { body, validationResult } from 'express-validator'

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidator = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .notEmpty()
        .withMessage('Username is required'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format'),
    body('password')
        .isString()
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must be at least 8 characters long and contain at least one letter, one number, and one special character'),
    validate
];

const loginValidator = [
    body('identifier')
        .isString()
        .withMessage('Identifier must be a string')
        .notEmpty()
        .withMessage('Identifier is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

const verifyValidator = [
    body('otp')
        .isNumeric()
        .isLength({ min: 6, max: 6 })
        .withMessage('OTP must be a 6-digit number'),
    validate
];

export { registerValidator, loginValidator, verifyValidator }
