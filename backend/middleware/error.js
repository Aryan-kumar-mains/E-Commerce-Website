// This error is to handle situation like if a product you want to find in a web,
// and that is not there, so in that case it's used

// This is the main error handling because we use this as a middle ware in app.js.

const ErrorHandler = require("../utils/errorhandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    // Cast Error -- Mongo Db error e.g. Wrong mongodb Id Error
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose Duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }


    // Wrong JWT error
    if(err.code === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }


    //  JWT Expiry error
    if(err.code === "TokenExpiredError"){
        const message = `Json Web Token is expired, try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        succes: false,
        error: err.message,
        // error : err.stack // use it to print the error message with their location
    });
};