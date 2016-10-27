var mongoose = require('mongoose');
var SchemaTypes =  mongoose.Schema.Types;

// User Schema
var PerAccSchema = mongoose.Schema({
    user_id: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bank: String,
    name: String,
    balance: SchemaTypes.Double,
    timestamp: 'Moment'
});

// Compile schema into a model and export model
var Personal_Account = module.exports = mongoose.model('Personal_Account', PerAccSchema, 'per_acc');

// Usable functions
module.exports.per_acc_fn = {
    createPerAcc: function (newPerAcc, callback) {
        newPerAcc.save(callback);
    },

    getAllPerAcc: function (callback) {
        Personal_Account.find()
            .sort({bank: 1})
            .exec(callback);
    },

    updatePerAcc: function (per_acc_obj, callback) {
        var query = {_id: per_acc_obj.id};
        var update = {$set: {
            bank: per_acc_obj.bank,
            name: per_acc_obj.name
        }};
        Personal_Account.update(query, update, callback);
    },

    removePerAcc: function (id, callback) {
        var query = {_id: id};
        Personal_Account.remove(query, callback)
    }
};
