// import { Post } from "../model/post.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";



// const Createpost = asyncHandler( async (req, res) => {



//     const { title ,desc ,email } = req.body
//     //console.log("email: ", email);

//     if (
//         [ title, desc, email ].some((field) => field?.trim() === "")
//     ) {
//         throw new ApiError(400, "All fields are required")
//     }
   
//     // let blogimgLocalPath;
//     // if (req.files && Array.isArray(req.files.blogimg) && req.files.blogimg.length > 0) {
//     //     blogimgLocalPath = req.files.blogimg[0].path
//     // }
    
//     // const blogimg = await uploadOnCloudinary(blogimgLocalPath)



//     const user = await Post.create({
//        title,desc,email,
//     })


//     return res.status(201).json(
//         new ApiResponse(200, user, "User registered Successfully")
//     )

// } )


// export {
//     Createpost,
// }