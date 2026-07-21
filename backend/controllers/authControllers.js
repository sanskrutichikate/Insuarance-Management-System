import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//register user
const register = async (req, res) => {
    try {
        const { name, email, password,role } = req.body;
        //check if all fileds are provided
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //new user
      const result = await pool.query(
      `INSERT INTO users(name, email, password, role)
       VALUES($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
    );

        res.status(201).json({
            message: "User Registered Successfully",
            user: result.rows[0],
        });

    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server errror",
        });
    }

};


//login user

const login = async (req, res) => {
    try {
        const {  email, password } = req.body;
        //check if all fileds are provided
        if ( !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length == 0) {
            return res.status(400).json({
                message: "Invaild Email or Password",
            });
        }

          const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Email or Password",
            });
        }

       const token=jwt.sign(
        {
            id:user.id,
            email:user.email,
            role:user.role,
        },
        process.env.JWT_SECRET,{
            expiresIn:"1d",
        }
       );
       
        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role:user.role,
            },
        });

         } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });

    }
};

export{register,login};