import mongoose from 'mongoose';

const templateVersionSchema = new mongoose.Schema({
  html: String,
  subject: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const emailTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  active: { type: Boolean, default: true },
  versions: [templateVersionSchema],
  currentVersion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model('EmailTemplate', emailTemplateSchema);