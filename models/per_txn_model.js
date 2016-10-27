var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

var PerTxnSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: 'Moment',
    type: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personal_Account'
    },
    desc: String,
    category: String,
    amount: SchemaTypes.Double,
    recurring: {
        option: String,
        frequency: String,
        start_date: String,
        no_of_pmt: Number
    },
    pmt_mode: String,
    payee: String,
    reminder: String,
    status: String,
    timestamp: 'Moment'
});

// Compile schema into a model and export model
var Personal_Txn = module.exports = mongoose.model('Personal_Txn', PerTxnSchema, 'per_txn');

// Usable functions
module.exports.per_txn_fn = {
    createPerTxn: function (newPerTxn, callback) {
        newPerTxn.save(callback);
    },

    getAllPerTxn: function (callback) {
        Personal_Txn.find()
            .sort({date: -1})
            .populate('account')
            .exec(callback);
    },

    updatePerTxn: function (per_txn_obj, callback) {
        var query = {_id: per_txn_obj.id};
        var update = {$set: {
            type: per_txn_obj.type,
            account: per_txn_obj.account_id,
            desc: per_txn_obj.desc,
            category: per_txn_obj.category,
            amount: per_txn_obj.amount,
            recurring: {
                option: per_txn_obj.recurring,
                frequency: per_txn_obj.recurring_freq,
                start_date: per_txn_obj.recurring_start_date,
                no_of_pmt: per_txn_obj.recurring_no_of_pmt
            },
            pmt_mode: per_txn_obj.pmt_mode,
            payee: per_txn_obj.payee,
            reminder: per_txn_obj.reminder,
            status: per_txn_obj.status
        }};
        Personal_Txn.update(query, update, callback);
    },

    removePerTxn: function (id, callback) {
        var query = {_id: id};
        Personal_Txn.remove(query, callback)
    }
};
