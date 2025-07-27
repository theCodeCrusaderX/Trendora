import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log("after -> \n",token);
        if (!token) {
            return res.json(new ApiResponse(401,"Unauthorized request"))
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log(`befor \n` , decodedToken);
        
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.json(new ApiResponse(401, "Invalid Access Token"))
        }
    
        req.user = user;
        next()
    } catch (error) {
        return res.json(new ApiResponse(401, error?.message || "Invalid access token"))

    }
    
})