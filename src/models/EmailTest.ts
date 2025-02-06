// src/models/EmailTest.ts
import mongoose from 'mongoose';

const emailTestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  templateA: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  templateB: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  results: {
    templateA: {
      sent: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 }
    },
    templateB: {
      sent: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 }
    }
  }
});

export const EmailTest = mongoose.models.EmailTest || mongoose.model('EmailTest', emailTestSchema);