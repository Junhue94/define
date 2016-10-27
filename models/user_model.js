var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    user_type: String,
    category: {type: Array, default: [
        'Accommodation', 'Automobile', 'Child Support', 'Donations', 'Entertainment', 'Food', 'Gifts', 'Groceries', 'Household', 'Salary', 'Insurance', 'Investment', 'Medicare', 'Personal Care', 'Pets', 'Shopping', 'Tax', 'Recreation', 'Transportation', 'Utilities', 'Vacation', 'Savings'
    ]},
    pmt_mode: {type: Array, default: [
        'Cash', 'Cheque', 'Credit Card', 'Debit Card', 'Electronic Transfer'
    ]},
    timestamp: 'Moment',
    passwordResetToken: String,
    passwordResetExpires: Number
});

// Compile schema into a model and export model
var User = module.exports = mongoose.model('User', UserSchema, 'users');

// Usable functions
module.exports.user_fn = {
    createUser: function (newUser, callback) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function (err, hash) {
                newUser.password = hash;
                newUser.save(callback);
            });
        })
    }
};
