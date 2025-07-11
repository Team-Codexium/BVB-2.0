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

  //array of url of audio coming from cloudinary of rapper1

  rapper1_audio_urls:[
    {
      title: {
        type: String,
        required: [true, 'Audio title for rapper1 is required'],
        trim: true
      },
      url: {
        type: String,
        required: [true, 'Audio URL for rapper1 is required']
      },

    }
  ],
  //array of url of audio coming from cloudinary of rapper2
  rapper2_audio_urls:[
    {
      title: {
        type: String,
        required: [true, 'Audio title for rapper2 is required'],
        trim: true
      },
      url: {
        type: String,
        required: [true, 'Audio URL for rapper2 is required']
      },
    }
  ],
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
    
  }
}, {
  timestamps: true
});

export const Battle = mongoose.model('Battle',battleSchema) 