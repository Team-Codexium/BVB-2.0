import mongoose from "mongoose";
const VoteSchema=new mongoose.Schema({
    battleId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"battleId is required"]
    },
    voterId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"voter id is required"]
    },
    votedfor:
    {
        type:mongoose.Schema.Types.ObjectId,
        //required:[true,"whom voted id is required"]
    }
}, {timestamps: true})


export const Vote=mongoose.model("Voting",VoteSchema);