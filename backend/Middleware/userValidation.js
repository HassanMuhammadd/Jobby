const yup = require("yup");

const userValidation = yup.object({
    name: yup.string().required(),
    email: yup.string().required(),
    password: yup.string()
    .min(6,'Password must be at least 6 characters long')
    .required('Password is required'),
 
    retypePassword: yup.string().required(),
    phone: yup.string().required(),
    industry: yup.string().required(),
    location: yup.string().required()
    
 })

module.exports = { 
    userValidation
}