import User from "../Models/User.js"
import { httpStatusCodes } from "../Status/httpStatusCodes.js"
const { BAD_REQUEST, SUCCESS } = httpStatusCodes

//implement cashe here

export const userInterfaceController = async (req,res) => {
  try {
    const infoUser = await User.findOne({ id: req.user.id }).select(" -__v -password -_id")
    if (!infoUser) {
      return res.status(BAD_REQUEST).json({
        err:"we dont found you"
      })
    }
    res.status(SUCCESS).json(infoUser)
  } catch (err) {
    res.status(BAD_REQUEST).json({
       err:err.message
     })
}
}
