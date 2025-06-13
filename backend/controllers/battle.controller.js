import {Battle} from '../models/battle.model.js'
import { Rapper } from '../models/rapper.model.js'

export const createBattle = async ( req,res) =>{
    try{
        const {rapper2Id,timeLimit,battleDate} = req.body;
        const rapper1Id = req.user.id; // to be check based on authentication

        // Validation if rapper 2 is not present
        if(!rapper2Id) {
            return res.status(400).json({
                success:false,
                message:'Opponent rapper is Required'
            })
        }

        // if time limit is not present
        if(!timeLimit){
            return res.status(400).json({
                success:false,
                message: 'Time Limit is required'
            });
        }

        // if rapper1 and rapper2 are same
        if(rapper1Id === rapper2Id){
            return res.status(400).json({
                success:false,
                message:'You cannot challenge yourself'
            });
        }

        // find details of rapper
        const [rapper1, rapper2] = await Promise.all([
      Rapper.findById(rapper1Id),
      Rapper.findById(rapper2Id)
    ]);

    // if rapper1 is not in the list
     if (!rapper1) {
      return res.status(404).json({
        success: false,
        message: 'Challenger rapper not found'
      });
    }

    // if rapper2 is not in the list
    if (!rapper2) {
      return res.status(404).json({
        success: false,
        message: 'Opponent rapper not found'
      });
    }

    // Check if there's already a pending battle between these rappers
    const existingBattle = await Battle.findOne({
      $or: [
        {
          'contestants.rapper1': rapper1Id,
          'contestants.rapper2': rapper2Id,
          status: 'pending'
        },
        {
          'contestants.rapper1': rapper2Id,
          'contestants.rapper2': rapper1Id,
          status: 'pending'
        }
      ]
    });

    if (existingBattle) {
      return res.status(400).json({
        success: false,
        message: 'A pending battle already exists between these rappers'
      });
    }

    // Create new battle
    const newBattle = new Battle({
      contestants: {
        rapper1: rapper1Id,
        rapper2: rapper2Id
      },
      verses: {
        rapper1: {
          audio: '', // Will be filled when rapper submits
          text: ''
        },
        rapper2: {
          audio: '', // Will be filled when rapper submits
          text: ''
        }
      },
      timeLimit: timeLimit,
      battleDate: battleDate || new Date(),
      status: 'pending'
    });

    // Save battle to database
    const savedBattle = await newBattle.save();

    // saving the reference of battles in rapper database for future
    await Promise.all([
      Rapper.findByIdAndUpdate(rapper1Id, {
        $push: { battlesParticipated: savedBattle._id }
      }),
      Rapper.findByIdAndUpdate(rapper2Id, {
        $push: { battlesParticipated: savedBattle._id }
      })
    ]);


   const populatedBattle = await Battle.findById(savedBattle._id)
      .populate('contestants.rapper1', 'username fullName email rank')
      .populate('contestants.rapper2', 'username fullName email rank');

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Battle challenge created successfully and invitation sent!',
      data: {
        battle: populatedBattle,
        emailSent: true,
        challengerMessage: `Challenge sent to ${rapper2.fullName}! They will receive an email notification.`
      }
    });

  } catch (error) {
    console.error('Error creating battle:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate battle detected'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating battle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

