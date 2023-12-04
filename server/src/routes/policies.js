import express from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";
import { verifyAdmin } from "./user.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import the required method


const router = express.Router();

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// admin routes


router.post('/updatePolicy', verifyToken, verifyAdmin, async (req, res) => {
    const { policyName, content } = req.body;

    // Define the path to the policy file based on the policyName
    const policyFilePath = path.join(__dirname, '..','..','..', 'client', 'public', 'policies', `${policyName}.html`);

    // Read the existing HTML file
    fs.readFile(policyFilePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error('Error reading policy file:', readErr);
            return res.status(500).json({ message: 'Error reading policy file' });
        }

        // Append new content as list item to the unordered list
        const updatedContent = data.replace(/(<ul id="policy-list">[\s\S]*<\/ul>)/, `$1\n    <li>${content}</li>`);

        // Write the updated content back to the file
        fs.writeFile(policyFilePath, updatedContent, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to policy file:', writeErr);
                return res.status(500).json({ message: 'Error updating policy file' });
            }

            res.status(200).json({ message: 'Policy updated successfully' });
        });
    });
});




export { router as policiesRouter };
