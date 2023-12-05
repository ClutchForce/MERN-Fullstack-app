import express from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";
import { verifyAdmin } from "./user.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import the required method
import { dmcaLogModel } from "../models/dmcaLog.js";
import { ReviewModel } from "../models/Review.js";


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

//dmca routes

// Endpoint to log a DMCA request
router.post('/logDmcaRequest/:reviewId', verifyToken, async (req, res) => {
    // Implementation to log DMCA request
    console.log("logDmcaRequest", req.body);
    // get the review using id
    const review = await ReviewModel.findById(req.params.reviewId);
    // create a new dmca log using the formate reviewId, dateSent, notes, status
    const dmcaLog = new dmcaLogModel({
        reviewId: req.params.reviewId,
        dateSent: Date.now(),
        notes: "User has requested to remove this review",
        status: "Active"
    });
    // save the dmca log
    await dmcaLog.save();

  });
  
// Endpoint to update DMCA log (e.g., when sending a notice or receiving a dispute)
router.put('/updateDmcaLog/:logId', verifyToken, verifyAdmin, async (req, res) => {
// Implementation to update DMCA log
});

// Endpoint to hide/unhide a review
router.put('/toggleReviewVisibility/:reviewId', verifyToken, verifyAdmin, async (req, res) => {
// Implementation to hide/unhide a review
});

// Endpoint to get all DMCA logs
router.get('/getDmcaLogs', verifyToken, verifyAdmin, async (req, res) => {
    try {
        // Get all DMCA logs
        console.log("getDmcaLogs");

        const dmcaLogs = await dmcaLogModel.find();

        // Initialize an array to store formatted data
        let returnData = [];

        for (const log of dmcaLogs) {
            // Get the review using the reviewId from each log
            const review = await ReviewModel.findById(log.reviewId);

            // Check if the review exists
            if (review.userId) {
                // Get the user using the userId from the review
                
                const user = await UserModel.findById(review.userId);

                // Check if the user exists
                if (user) {
                    returnData.push({
                        reviewId: log.reviewId,
                        comment: review.comment,
                        nickname: user.nickname,
                        dateSent: log.dateSent,
                        notes: log.notes,
                        status: log.status
                    });
                }
            }
        }

        // Return the data
        res.json(returnData);
    } catch (error) {
        console.error('Error getting DMCA logs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export { router as policiesRouter };
