import { User } from "../model/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Token }  from '../model/token.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const signupUser = async (req, res) => {
    try {
        const { fullName ,username , email , password } = req.body
        if (
            [ fullName ,username , email , password ].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })
    
        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists")
        }


        const user = await User.create({
            fullName,
            email, 
            password,
            username,
        })

        const createdUser = await User.findById(user._id).select(
            "-password"
        )
    
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user")
        }
     
     
         return res.status(201).json(
             new ApiResponse(200, createdUser, "post created Successfully")
         )
    } catch (error) {
        res.status(500).json(error);
    }
}



export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
            response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.fullName, username: user.username });
        
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}


export const logoutUser = async (request, response) => {
    const token = request.body.token;

    try {
        const result = await Token.deleteOne({ token: token });

        if (result.deletedCount > 0) {
            // Token was successfully deleted
            response.status(204).json({ msg: 'Logout successful' });
        } else {
            // Token not found in the database
            response.status(404).json({ error: 'Token not found' });
        }
    } catch (error) {
        // Generic error during deletion
        console.error('Error during logout:', error);
        response.status(500).json({ error: 'Error during logout' });
    }
};



