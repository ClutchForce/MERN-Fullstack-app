import mongoose from "mongoose";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserModel } from './models/Users.js';


mongoose.connect('mongodb://localhost:27017/se3316Lab4', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Function to update user's admin status
async function makeUserAdmin(nickname) {
    try {
        const result = await UserModel.findOneAndUpdate({ nickname: nickname }, { isAdmin: true }, { new: true });
        if (result) {
            console.log(`User ${nickname} is now an admin.`);
        } else {
            console.log(`User with nickname ${nickname} not found.`);
        }
    } catch (error) {
        console.error('Error updating user admin status:', error);
    }
}

// Call the function with the desired nickname
makeUserAdmin('ClutchAdmin').then(() => {
    mongoose.disconnect();
});