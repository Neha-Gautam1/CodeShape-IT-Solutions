import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    role: {
    type: String,
    default: 'parent',
    enum: ['parent']
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]

},{
    timestamps:true
});

export default  mongoose.model("Parent",parentSchema);