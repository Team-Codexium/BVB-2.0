import mongoose from 'mongoose'

const battleSchema = new mongoose.Schema({

  // Storing contestants refernce 
    contestants: {
    rapper1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rapper',
      required: [true, 'First contestant is required']
    },
    rapper2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rapper',
      required: [true, 'Second contestant is required']
    }
  },

  // storing single audio and wriiten verse in text file of both rappers as object
  verses: {
    rapper1: {
      audio: {
        type: String, // URL or file path to audio
        // required: [true, 'Audio verse for rapper1 is required']
      },
      text: {
        type: String,
        // required: [true, 'Text verse for rapper1 is required'],
        trim: true
      }
    },
    rapper2: {
      audio: {
        type: String, // URL or file path to audio
        // required: [true, 'Audio verse for rapper2 is required']
      },
      text: {
        type: String,
        // required: [true, 'Text verse for rapper2 is required'],
        trim: true
      }
    }
  },

  // Store votes of individual rappers
  voting: {
    rapper1Votes: {
      type: Number,
      default: 0,
      min: [0, 'Votes cannot be negative']
    },
    rapper2Votes: {
      type: Number,
      default: 0,
      min: [0, 'Votes cannot be negative']
    },
    voters: [{
      // storing user to avoid multiple votes from same user
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rapper' // right now rappers are voting
      },

      votedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rapper'
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // winnner decided after time over 
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rapper',
    default: null
  },

  battleDate: {
    type: Date,
    default: Date.now
  },

  
  timeLimit: {
    type: Number, // Time limit in minutes
    required: [true, 'Time limit is required'],
    min: [30, 'Time limit must be at least 1 minute'],
    max: [10080, 'Time limit cannot exceed 7 days (10080 minutes)']
  },

  /*
  when battle created -> pending
  when accepted by other contestant -> active
  after time limited exceeded -> completed
  if cancelled by any one -> cancelled
  */
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },

  // if active then it must be true , else no need 
  endTime: {
    type: Date,
    required: function() {
      return this.status === 'active';
    }
  }
}, {
  timestamps: true
});

export const Battle = mongoose.model('Battle',battleSchema) 