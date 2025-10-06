const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// automatic store user in req.user and  password
// UserModel.register(req.user,req.password)  -> create new user
// req.logout()
// req.isAuthenticated()  ->   check if already login
// passport.authenticate("local", {})  ->   check if user password correct

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
