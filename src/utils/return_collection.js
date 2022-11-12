const User= require('../models/User')
const Personal=require('../models/Personal')
const Employee=require('../models/Employee')
const Bank=require('../models/Bank')
const Loan = require('../models/Loan')
const Documents=require('../models/Documents')
const result= (input)=>
{
    switch(input)
    {
        case 'user': return User;
        case 'personal': return Personal;
        case 'employee': return Employee;
        case 'bank': return Bank;
        case 'loan': return Loan;
        case 'documents':return Documents;
    }
}
module.exports=result