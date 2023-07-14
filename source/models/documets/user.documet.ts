import { model, Schema } from "mongoose";
import IUserModel from "../interfaces/user.interface";
var userSchema = new Schema(
    {
        email: String,
        password: String,
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);
const User = model<IUserModel>("user", userSchema);

export default User;
