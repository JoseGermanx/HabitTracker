const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  frequency: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly']
  },
  targetDays: [{
    type: Number,
    min: 0,
    max: 6
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  reminderTime: {
    type: String
  },
  progress: [{
    date: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: String
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Method to check if habit is completed for a specific date
habitSchema.methods.isCompletedForDate = function(date) {
  const progress = this.progress.find(p => 
    p.date.toDateString() === date.toDateString()
  );
  return progress ? progress.completed : false;
};

// Method to get completion streak
habitSchema.methods.getCurrentStreak = function() {
  const sortedProgress = this.progress
    .filter(p => p.completed)
    .sort((a, b) => b.date - a.date);

  if (sortedProgress.length === 0) return 0;

  let streak = 1;
  for (let i = 0; i < sortedProgress.length - 1; i++) {
    const curr = sortedProgress[i].date;
    const next = sortedProgress[i + 1].date;
    const diffDays = Math.floor((curr - next) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;