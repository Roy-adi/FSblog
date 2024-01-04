import { Post } from "../model/post.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



export const createPost = async (req, res) => {
    try {
        const { title ,desc ,email,categories,username } = req.body
        if (
            [ title, desc, email ].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required")
        }

        let blogimgLocalPath;

    if (req.files && Array.isArray(req.files.blogimg) && req.files.blogimg.length > 0) {
        blogimgLocalPath = req.files.blogimg[0].path
    }
    

    const blogimg = await uploadOnCloudinary(blogimgLocalPath)

     // Access the userId from the authenticated user
     const userId = req.user._id;

    // console.log(title, desc, email , 'before');
    // console.log(blogimg , 'before-img');   
        const user = await Post.create({
            title,desc,email,
            blogimg: blogimg?.url || "",
            owner: userId,
            categories,username
         })

         return res.status(201).json(
             new ApiResponse(200, user, "post created Successfully")
         )
    } catch (error) {
        res.status(500).json(error);
    }
}


export const updatePostAndImage = async (req, res, next) => {
    const { title, desc, email } = req.body;
    // const blogLocalPath = req.file?.path;
    // console.log('Request Body:', req.body);
    // console.log('Request Files:', req.files);
    try {
      // Update blog data
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        throw new ApiError(404, 'Post not found');
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { title, desc, email },
        { new: true }
      );
  
      if (!updatedPost) {
        throw new ApiError(404, 'Post not found');
      }
  
      // Update blog image
      let blogimgLocalPath;

      if (req.files && Array.isArray(req.files.blogimg) && req.files.blogimg.length > 0) {
          blogimgLocalPath = req.files.blogimg[0].path
      }
  
      const blogimg = await uploadOnCloudinary(blogimgLocalPath);
  
    //   if (!blogimg.url) {
    //     throw new ApiError(400, 'Error while uploading on avatar');
    //   }
  
      const postWithImage = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            blogimg: blogimg.url,
          },
        },
        { new: true }
      );
  
      return res.status(201).json(
        new ApiResponse(200, postWithImage, 'Update successfully')
      );
    } catch (error) {
      // Pass the error to the error-handling middleware
      next(error);
    }
  };





// export const updatePost = async (req, res) => {
//     try {
//       const { title, desc, email } = req.body;
  
//       const post = await Post.findById(req.params.id);
  
//       if (!post) {
//         return res.status(404).json({ msg: 'Post not found' });
//       }
  
//       let updatedData = {
//         title: title || post.title,
//         desc: desc || post.desc,
//         email: email || post.email,
//       };
  
//       if (req.files && Array.isArray(req.files.blogimg) && req.files.blogimg.length > 0) {
//         const imageLocalPath = req.files.blogimg[0].path;
//         const cloudinaryResult = await uploadOnCloudinary(imageLocalPath);
//         updatedData.blogimg = cloudinaryResult.url;
//       }
  
//       const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
//       if (!updatedPost) {
//         return res.status(404).json({ msg: 'Post not found' });
//       }
  
//       return res.status(200).json({
//         statusCode: 200,
//         data: updatedPost,
//         message: 'Update successful',
//         success: true,
//       });
  
//     } catch (error) {
//       res.status(500).json(error);
//     }
//   };
  



// export const createPost = async (request, response) => {
//     try {
//         const post = await new Post(request.body);
//         post.save();

//         response.status(200).json('Post saved successfully');
//     } catch (error) {
//         response.status(500).json(error);
//     }
// }

// export const getAllPosts = async(req,res)=>{
//     let posts;
//     try{
//         posts = await Post.find({});  
//         return res.status(201).json(
//             new ApiResponse(200, posts, "all posts")
//         )
//     }catch(error) {
//         return res.status(500).json({msg:error.message})
//     }
// }

export const getAllPosts = async (request, response) => {
    let category = request.query.category;
    let posts;
    try {
        if (category) 
            posts = await Post.find({ categories: category });
        else 
            posts = await Post.find({});
            
        response.status(200).json(posts);
    } catch (error) {
        response.status(500).json(error)
    }
  }






export const getPost = async (request, response) => {
    try {
        const post = await Post.findById(request.params.id);

        return response.status(201).json(
            new ApiResponse(200, post, "get post")
        )
    } catch (error) {
        response.status(500).json(error)
    }
}

// export const updatePost = async (req, res) => {
//     const { title, desc, email } = req.body;
//     try {
//         const post = await Post.findById(req.params.id);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

        

//         if (!updatedPost) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         return res.status(201).json(
//             new ApiResponse(200, updatedPost, "update successfully ")
//         )
//     } catch (error) {
//         res.status(500).json(error);
//     }
// }





// export const updatePost = async (request, response) => {
//     try {
//         const post = await Post.findById(request.params.id);

//         if (!post) {
//             response.status(404).json({ msg: 'Post not found' })
//         }
        
//         await Post.findByIdAndUpdate( request.params.id, { $set: request.body })

//         response.status(200).json('post updated successfully');
//     } catch (error) {
//         response.status(500).json(error);
//     }
// }






export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ msg: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
}










// export const updatePost = async (request, response) => {
//     try {
//         const post = await Post.findById(request.params.id);

//         if (!post) {
//             return response.status(404).json({ msg: 'Post not found' });
//         }
        
//         const updatedPost = await Post.findByIdAndUpdate(request.params.id, { $set: request.body }, { new: true });

//         if (!updatedPost) {
//             return response.status(404).json({ msg: 'Post not found' });
//         }

//         response.status(200).json(updatedPost);
//     } catch (error) {
//         response.status(500).json(error);
//     }
// }


// export const editpost = async ( req, res)=>{
//     const { title ,desc , email} = req.body
//     try {
//         const post = await Post.findById(req.params.id);

//         if (!post) {
//             return response.status(404).json({ msg: 'Post not found' });
//         }
//         const editpostdata = await Post.findByIdAndUpdate( req.params.id , req.body,{new:true} )
//         response.status(200).json(editpostdata);
//     } catch (error) {
//         response.status(500).json(error);
//     }
// }
