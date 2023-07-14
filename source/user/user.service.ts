import { axiosGet } from "../services/axios.service"

/**
 * 
 * @returns random user from third party api
 */
const getRandomUser =async () => {
    const getRandomUser = await axiosGet("https://randomuser.me/api/")
    return getRandomUser.data
}

export default { getRandomUser }