import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //Hash Password
    const hashedPassword = await bcrypt.hashSync(password, 10);
    console.log(`hashed password: ${hashedPassword}`);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  //db operations
  const { username, password } = req.body;
  try {
    //Check if user exists already
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    //Check user password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    //Generate Cookie JWT token and send to user

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("Successfully sent");

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true, // if using HTTPS
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error(err);
    req.status(500).json({ message: "Failed to login " });
  }
};

export const logout = (req, res) => {
  //db operations
  res.clearCookie("token").json({ message: "Logged out successfully" });
};
