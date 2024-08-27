const express =require('express');
const router=express.Router();
const register_controller=require('../controller/register_controller')
const login_controller=require('../controller/login_controller')
const logout_controller=require('../controller/logout_controller')
const add_remove_action_controller=require('../controller/add_remove_action_controller')
const user_access_list_controller=require('../controller/user_access_list_controller')
const validation_controller=require('../controller/validation_controller')
const get_address_book_controller = require('../controller/get_address_book_controller')
const insert_address_book_controller = require('../controller/insert_address_book_controller')
const user_address_book_validation_controller = require('../controller/user_address_book_validation_controller')
const update_socket_user_controller = require('../controller/update_socket_user_controller')
const delete_user_id_controller = require('../controller/delete_user_id_controller')
const get_my_details_controller = require('../controller/get_my_details_controller')
const delete_adress_book_controller = require('../controller/delete_adress_book_controller')
const alter_user_status_controller = require('../controller/alter_user_status_controller')
const UPDATE_USER_DETAILS_controller =require('../controller/UPDATE_USER_DETAILS_controller')
const CHANGE_PASSWORD_controller=require('../controller/CHANGE_PASSWORD_controller')
const get_about_us_controller=require('../controller/get_about_us_controller');
const forgot_password_controller=require('../controller/forgot_password_controller')
const JwtVerify = require('../middleware/JwtTotenVerify');
const manageUserController=require('../controller/manageUserController');
const getonlineconnects_controller=require('../controller/getonlineconnects_controller')
const getoflineconnects_controller=require('../controller/getoflineconnects_controller')






// const insert_connection_Details_controller = require('../controller/insert_connection_Details_controller')
//router.post('/register',register_controller.register)
//router.route('/login').post(login);
router.route('/login').post(login_controller.login);
router.route('/register').post(register_controller.register);
router.route('/logout').post(logout_controller.logout);
router.route('/add_remove_action').post(add_remove_action_controller.add_remove_action);
router.route('/user_access_list').post(user_access_list_controller.user_access_list);
router.route('/validation').post(validation_controller.validation);
router.route('/get_address_book').post(get_address_book_controller.get_address_book)
router.route('/insert_address_book').post(insert_address_book_controller.insert_address_book)
router.route('/user_address_book_validation').post(user_address_book_validation_controller.user_address_book_validation)
router.route('/update_socket_user').post(update_socket_user_controller.update_socket_user)
router.route('/delete_user_id').post(delete_user_id_controller.delete_user_id)
router.route('/get_my_details').post(get_my_details_controller.get_my_details)
router.route('/delete_address_book').post(delete_adress_book_controller.delete_address_book)
router.route('/alter_user_status').get(alter_user_status_controller.alter_user_status)
router.route('/updateuserdetails').post(UPDATE_USER_DETAILS_controller.UPDATE_USER_DETAILS);
router.route('/changepassword').post(CHANGE_PASSWORD_controller.CHANGE_PASSWORD);
router.route('/getaboutus').get(get_about_us_controller.get_about_us);
// Route to send OTP
router.post('/send-otp', forgot_password_controller.sendOtp);
router.post('/manageUser', manageUserController.manageUser);
router.route('/getonlineconnects').get(getonlineconnects_controller.getonlineconnects);
router.route('/getoflineconnects').get(getoflineconnects_controller.getoflineconnects);

// Route to verify OTP
router.post('/verify-otp', forgot_password_controller.verifyOtp);

// Route to reset password
router.post('/reset-password', forgot_password_controller.resetPassword);
// router.route('/insert_connection_Details').post(insert_connection_Details_controller.insert_connection_Details)
module.exports=router
