const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    budget: { type: Number, required: true },
}, {
    timestamps: true
});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;