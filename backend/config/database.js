const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true
                
    }).then((data) => {
        console.log(`Mongodb connected with server: ${data.connection.host}`);

    });

    // .catch((err) => {        // removing it because we are doing unhandled promise rejection(see the server.js)
    //     console.log(err)
    // })

}

module.exports = connectDatabase