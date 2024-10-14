import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Token Cookies" + req.cookies); // Check if the token is being received

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res
        .status(403)
        .json({ message: "Token is not valid or expired!" });
    }
    req.userId = payload.id;
    next();
  });
};
