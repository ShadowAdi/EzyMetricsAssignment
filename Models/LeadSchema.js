const mongoose = require("mongoose")

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    source: {
        type: String
    },
    campaign: {
        type: mongoose.Schema.ObjectId,
        ref: "Campaign",
        required: true
    },
}, {
    timestamps: true
})

const Lead = mongoose.model("Lead", LeadSchema)
module.exports=Lead