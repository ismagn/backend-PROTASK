import mongoose from "mongoose";
import dotenv from "dotenv"
const conectarDB = async () =>{


    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,);
        
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log("url: ",url);
    } catch (error) {
        console.log(error);
        process.exit(1) //es para forzar que el proceso termine cuando haya error
    }
}

export default conectarDB;