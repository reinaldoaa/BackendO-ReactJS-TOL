const {Schema,model} = require('mongoose');
const bcrypy = require('bcryptjs');
const userSchema = new Schema({
    username: {type:String, required:true, unique:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    name:String,
    roles : [{ref:"Rol", type: Schema.Types.ObjectId }],
    create_at:{type:Date,default: new Date()},
    versionKey: false,
});
    //  roles : {type:Object,required:true },
    
userSchema.methods.verifyPassword = function (password){
    return bcrypy.compare(password, this.password);
}
userSchema.methods.encryptPassword = async (password) =>{
    const salt = await bcrypy.genSalt(10);
    return bcrypy.hash(password,salt);
};

module.exports = model('User', userSchema);
