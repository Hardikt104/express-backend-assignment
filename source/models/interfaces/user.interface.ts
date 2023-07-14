import { Types } from "mongoose"

export interface IuserModel extends Document {
    email:string,
    password:string,
    _id: Types.ObjectId
}
export default IuserModel