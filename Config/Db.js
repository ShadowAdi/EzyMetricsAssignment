const mongoose = require("mongoose")

const Connect = async (app) => {
    mongoose.connect(process.env.MONGODB_CONNECTION).then((res) => {
        console.log("DB Connected")
        app.listen(3000, () => console.log("Server running on port 3000"))
    }).catch(() => {
        console.log("DB Connection Failed")
    })
}

module.exports = Connect