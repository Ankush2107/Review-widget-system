import mongoose from 'mongoose';

const widgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Widget name is required'],
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
  googlePlaceId: {
    type: String,
    sparse: true
  },
  facebookPageUrl: {
    type: String,
    sparse: true
  },
  active: {
    type: Boolean,
    default: true
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  totalRating: {
    type: Number,
    default: 0
  },
  lastSync: {
    type: Date
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

// Update timestamps pre-save
widgetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Widget = mongoose.models.Widget || mongoose.model('Widget', widgetSchema);