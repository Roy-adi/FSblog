import { Router } from "express";
import { createPost, deletePost, getAllPosts, getPost, updatePostAndImage } from "../controllers/GetAll.js";
import { loginUser, logoutUser, signupUser } from "../controllers/Auth.js"
import { upload } from "../middleware/multer.js";
import { authenticateToken } from "../controllers/jwtvarify.js";

const router = Router()

router.route('/signup').post(signupUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser);
router.route('/create').post(authenticateToken, upload.fields([
    {
        name: "blogimg",
        maxCount: 1
    }, 
]), createPost)
router.route('/all').get(getAllPosts)
router.route('/posts/:id').get(getPost)
router.route('/update/:id').put(
    upload.fields([
      {
        name: "blogimg",
        maxCount: 1
      }, 
    ]),
    updatePostAndImage
  );
router.route('/delete/:id').delete(deletePost)
router.route('/post/:id').get(getPost)

export default router