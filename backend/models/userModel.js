import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
},{
    timestamps: true
})

userSchema.methods.checkPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// Define a pre-save middleware to hash the password before saving the user
userSchema.pre('save', async function(next) {
        // Only hash the password if it has been modified (or is new)
    if(!this.isModified('password')){
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10) // hash salt = 10
})

const User = mongoose.model("User", userSchema)

export default User