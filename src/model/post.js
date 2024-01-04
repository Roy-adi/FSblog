import mongoose , {Schema} from "mongoose";


const postSchema = new Schema({

    title:{
        type: String,
    },

    desc:{
        type:String
    },

    email:{
        type:String
    },
    
    blogimg:{
        type:String
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },

    categories:{
        type: String
    },

    username:{
        type:String
    }



},{timestamps:true})


export const Post = mongoose.model('Post', postSchema)