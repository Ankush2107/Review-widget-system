import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  widgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Widget',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0
  },
  domains: [{
    domain: String,
    views: Number,
    lastAccessed: Date
  }],
  dailyStats: [{
    date: Date,
    views: Number,
    impressions: Number
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);