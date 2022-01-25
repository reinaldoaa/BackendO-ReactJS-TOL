const {Schema,model} = require('mongoose');

const rolSchema = new Schema({
    name: {type: String, enum: rols, required:true, unique:true},
    create_at: {type: Date,default:new Date()},
})

module.exports = model("Rol", rolSchema);
