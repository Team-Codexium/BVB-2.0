import mongoose from 'mongoose'

const connectDB = async ()=>{
    try{
        mongoose.connection.on('connected',()=>{
            console.log("Databse Connected");
            
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/BVB`)
    }
    catch(error){
        console.log("Database Not Connected",error);
    }
}

export default connectDB