import express from "express";
import { register,login } from "../controllers/authControllers.js";

const router=express.Router();
 router.post ("/register",register);  //register api
 router.post ("/login",login);      //login api


 export default router;
