import jwt from "jsonwebtoken";


import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {

  const token = req.headers.token;
  if (!token) return res.status(401).json({ success: false, message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id);

    req.company = await Company.findById(decoded.id).select('-password');
    if (!company) return res.status(401).json({ success: false, message: "Not authorized" });
    req.company = company;
    next();
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }

}