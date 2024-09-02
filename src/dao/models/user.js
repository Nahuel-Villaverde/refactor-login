import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: { type: String, default: "user" },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Carritos' },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [
        {
            name: String, // Nombre del documento
            reference: String // Link al documento
        }
    ],
    last_connection: Date
});

const User = mongoose.model(userCollection, userSchema);

export default User;