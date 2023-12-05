import mongoose from "mongoose";
import { reviewSchema } from "./Review.js"; 

// DMCA Log Model
const dmcaLogSchema = mongoose.Schema({
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true,
    },
    dateSent: {
        type: Date,
        default: Date.now,
      },    
    dateRequestReceived: 
    {
        type: Date,
        default: null,
    },
    dateDisputeRecived: 
    {
        type: Date,
        default: null,
    },
    notes: 
    {
        type: String,
        required: false,
    },
    status: 
    {
        type: String,
        required: true,
    } // 'Active', 'Processed', etc.
});
  
export const dmcaLogModel = mongoose.model("DMCA_Log", dmcaLogSchema);
  
  