import { model, Schema } from "mongoose";

import ITokenModel from "../interfaces/token.interface";
var tokensSchema = new Schema({
    token: { type: String, required: true, index: true, },
    type: {
        type: Number,
        required: true,
    },
    expiresAt: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true }
}, {
    timestamps: true,
    toObject: { getters: true },
    toJSON: { getters: true },
});
const Tokens = model<ITokenModel>("tokens", tokensSchema);

export default Tokens