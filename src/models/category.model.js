const {Schema,model} = require('mongoose');

const categorySchema = new Schema({
    name        : {type: String,required:true,unique:true},
    create_at: {type: Date,default:new Date()},
    //date_upd_ins: {timestamps: true }
})

module.exports = model("Category", categorySchema);