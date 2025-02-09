const mongoose = require("mongoose");

const db_password = "Airbus5575";
const connectDB = async () => {
    await mongoose.connect(
        `mongodb+srv://DhruvMehta:${db_password}@namastenode.rn3ld.mongodb.net/devTinder`
    )
}

module.exports = connectDB;

