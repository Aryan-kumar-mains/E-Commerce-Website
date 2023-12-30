const dotenv = require("dotenv");

const app = require("./app");
const connectDatabase = require("./config/database.js")

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})


// config 
dotenv.config({path: "backend/config/config.env"});

// connect the db after configuring the above .env file
connectDatabase()

const server = app.listen(process.env.PORT, () =>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    
    server.close(() => {
        process.exit(1);
    });
});