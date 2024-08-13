import { Document, model, models, Schema } from "mongoose";

export interface IImage extends Document {
    title: string;
    transformationType: string;
    publicId: string;
    secureURL: string; 
    width?: number;
    height?: number;
    config?: object; 
    _id: string;
    transformationUrl?: string; 
    aspectRatio?: string;
    color?: string;
    prompt?: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
    }
    createdAt?: Date;
    updatedAt?: Date;
  }
  

const ImageScehma = new Schema({
    title:{
        type:String,
        requried:true
    },
    transformationType:{
        type: String,
        required:true
    },
    publicId:{
        type: String,
        required:true
    },
    secureURL:{
        type:String,
        required:true
    },
    width:Number,
    height: Number,
    config:{
        type:Object
    },
    transformationUrl:{
        type:String
    },
    aspectRatio: String,
    color:String,
    prompt:String,
    author:{
        type: Schema.Types.ObjectId,ref: 'User'
    },
    createdAt:{
        type: Date,default: Date.now
    },
    updatedAt:{
        type: Date,default: Date.now
    },
})

const Image = models?.Image || model('Image',ImageScehma)

export default Image