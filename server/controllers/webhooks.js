import { Webhook } from "svix";
import User from "../models/User.js";

// Api controller function to manage clerk user with database

export const clerkWebhooks = async (req, res) => {
  try {
    // create svix instance with clerk webhook secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    //  verify headers
    await wh.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Log incoming webhook data
    console.log("Received webhook data:", req.body);

    // getting data from request body
    const { data, type } = req.body;
    // switch case for different events
    switch (type) {
      case "user.created":
        {
          const userData = {
            _id: data.id,
            name: data.first_name + " " + data.last_name,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
            resume: "",
          }
          await User.create(userData);
          res.json({ message: "User created" });
          break;
        }
      case "user.updated":
        {
          const userData = {

            name: data.first_name + " " + data.last_name,
            email: data.email_addresses[0].email_address,
            image: data.image_url,
          }
          const userUpdated = await User.findByIdAndUpdate(data.id, userData);
          if (userUpdated) {
            res.json({ message: "User updated" });
          }
          else {
            res.json({ message: "User not updated" });

          }
          break;
        }
      case "user.deleted":
        {
          await User.findByIdAndDelete(data.id);
          res.json({ message: "User deleted" });
          break;
        }
      default:
        break;
    }
  }
  // Error handling
  catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

