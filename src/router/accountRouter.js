const router = require('express').Router();
const accountController=require('../controllers/accountController')
const passport = require("passport");
const hasPermissions=require('../utils/permissionChecker')

router.post('/', accountController.addAccount);
router.post('/login',accountController.loginAccount);
// router.get('/get',passport.authenticate("customer", { session: false }),accountController.getAccounts);
router.get('/get/:id',passport.authenticate("customer", { session: false }),accountController.getAccountById);
router.put('/',passport.authenticate("customer", { session: false }),accountController.editAccount);
// router.delete('/',passport.authenticate("user", { session: false }),hasPermissions,accountController.deleteUser);

module.exports=router