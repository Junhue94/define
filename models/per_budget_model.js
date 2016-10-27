var mongoose = require('mongoose');
var SchemaTypes = mongoose.Schema.Types;

// User Schema
var PerBudgetSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: String,
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personal_Account'
    },
    period: 'Moment',
    allocated: SchemaTypes.Double,
    spent: SchemaTypes.Double,
    remained: SchemaTypes.Double,
    utilized: Number,
    surplus_color: String,
    timestamp: 'Moment'
});

// Compile schema into a model and export model
var Personal_Budget = module.exports = mongoose.model('Personal_Budget', PerBudgetSchema, 'per_budget');

// Usable functions
module.exports.per_budget_fn = {
    createPerBudget: function (newPerBudget, callback) {
        newPerBudget.save(callback);
    },

    getAllPerBudget: function (callback) {
        Personal_Budget.find()
            .sort({period: -1})
            .populate('account')
            .exec(callback);
    },

    updatePerBudget: function (per_budget_obj, callback) {
        var query = {_id: per_budget_obj.id};
        var update = {$set: {
            category: per_budget_obj.category,
            account: per_budget_obj.account,
            period: per_budget_obj.period,
            allocated: per_budget_obj.allocated
        }};
        Personal_Budget.update(query, update, callback);
    },

    removePerBudget: function (id, callback) {
        var query = {_id: id};
        Personal_Budget.remove(query, callback)
    }
};
