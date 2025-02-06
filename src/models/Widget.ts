import mongoose from 'mongoose';

const widgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  settings: {
    type: {
      type: String,
      enum: ['slider', 'grid', 'list', 'masonry', 'badge'],
      required: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    showRating: {
      type: Boolean,
      default: true
    },
    showSource: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    },
    itemsPerPage: {
      type: Number,
      default: 1
    }
  },
  sources: [{
    type: String,
    enum: ['google', 'facebook']
  }],
  businessDetails: {
    name: String,
    googlePlaceId: String,
    facebookPageUrl: String
  },
  active: {
    type: Boolean,
    default: true
  },
  sentimentStats: {
    averageScore: Number,
    positiveCount: Number,
    negativeCount: Number,
    neutralCount: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp before saving
widgetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Widget = mongoose.models.Widget || mongoose.model('Widget', widgetSchema);