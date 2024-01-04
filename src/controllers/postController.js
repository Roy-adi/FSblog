import { Post } from "../model/post.js";
import { User } from "../model/user.js";



export const getPostOwner = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Find the post by _id and populate the 'owner' field (excluding the password)
        const post = await Post.findById(postId).populate({
            path: 'owner',
            select: '-password', // Exclude the password field
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Access the user data from the populated 'owner' field
        const user = post.owner;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return user details without the password
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
  
  