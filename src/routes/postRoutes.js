// postRoutes.js

import { Router } from "express";
import { getPostOwner } from '../controllers/postController.js';


const router = Router()

// Define the route to get user details by post _id
router.route('/post/:postId/user').get(getPostOwner)

export default router;
