const {Schema,model} = require('mongoose');

const productSchema = new Schema({
    name        : {type: String,required:true},
    description : {type: String,requerid:true},
    poster      : {type: Object,required:true},
    gallery     : Array,
    category    : {ref: 'Category', type: Schema.Types.ObjectId },
    price       : {type: Number,required:true,default:0},
    discount    : {type: Number,default:0},
    stock       : {type: Number,default:0},
    create_at: {type: Date,default:new Date()},
    //update_at: {timestamps: true },
})
//sku         : {type: String,required:true,unique:true},  
    //date_upd_ins: {timestamps: true }

module.exports = model("Product", productSchema);