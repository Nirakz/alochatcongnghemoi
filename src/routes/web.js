import express from "express";
import {home, auth, user, contact, notification, message, groupChat, extras} from "./../controllers/index";
import {authValid, userValid, contactValid, messageValid, groupChatValid, extrasValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";
import UserModel from "./../models/userModel";

// Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);
  router.post("/admin",authValid.admin , auth.postAdmin, auth.getAdmin);
  router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);
  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));
  router.get("/auth/facebook", auth.checkLoggedOut, passport.authenticate("facebook", {scope: ["email"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedOut, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));
  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", {scope:  ["openid", "email", "profile"]}));
  router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));
  router.post("/admin", auth.postAdmin);

  router.get("/", auth.checkLoggedIn, home.getHome);
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);
  
  router.put("/user/update-avatar", auth.checkLoggedIn, user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn, userValid.updateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedIn, userValid.updatePassword, user.updatePassword);

  router.get("/contact/find-users/:keyword",
    auth.checkLoggedIn,
    contactValid.findUsersContact,
    contact.findUsersContact);
  router.post("/contact/add-new", auth.checkLoggedIn, contact.addNew);
  router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
  router.delete("/contact/remove-request-contact-sent",
    auth.checkLoggedIn,
    contact.removeRequestContactSent);
  router.delete("/contact/remove-request-contact-received",
    auth.checkLoggedIn,
    contact.removeRequestContactReceived);
  router.put("/contact/approve-request-contact-received",
    auth.checkLoggedIn,
    contact.approveRequestContactReceived);
  router.get("/contact/read-more-contacts", auth.checkLoggedIn, contact.readMoreContacts);
  router.get("/contact/read-more-contacts-sent", auth.checkLoggedIn, contact.readMoreContactsSent);
  router.get("/contact/read-more-contacts-received", auth.checkLoggedIn, contact.readMoreContactsReceived);
  router.get("/contact/search-friends/:keyword",
    auth.checkLoggedIn,
    contactValid.searchFriends,
    contact.searchFriends);

  router.get("/notification/read-more", auth.checkLoggedIn, notification.readMore);
  router.put("/notification/mark-all-as-read", auth.checkLoggedIn, notification.markAllAsRead);
  
  router.post("/message/add-new-text-emoji", auth.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);
  router.post("/message/add-new-image", auth.checkLoggedIn, message.addNewImage);
  router.post("/message/add-new-attachment", auth.checkLoggedIn, message.addNewAttachment);
  router.get("/message/read-more-all-chat", auth.checkLoggedIn, message.readMoreAllChat);
  router.get("/message/read-more", auth.checkLoggedIn, message.readMore);

  router.post("/group-chat/add-new", auth.checkLoggedIn, groupChatValid.addNewGroup, groupChat.addNewGroup);

  // extras, not in videos
  router.get("/conversation/search/:keyword", auth.checkLoggedIn, extrasValid.searchConversation, extras.searchConversation);
  router.get("/message/read-more-personal-chat", auth.checkLoggedIn, extras.readMorePersonalChat);
  router.get("/message/read-more-group-chat", auth.checkLoggedIn, extras.readMoreGroupChat);

  router.get('/admin', function(req, res, next) {
   //{ title: 'data', userData: data}
   UserModel.find({}, function(err, data) {
    // note that data is an array of objects, not a single object!
    res.render('admin/managerUser',{ 'Userdata': data});
    

})});
router.get('/deleteUserbyID', function(req, res, next) {
  //{ title: 'data', userData: data}
  let id = req.query._id;
  UserModel.findByIdAndRemove(id, function(err, data) {
   // note that data is an array of objects, not a single object!
   res.redirect('/admin');
   

})});
  return app.use("/", router);
};



module.exports = initRoutes;
