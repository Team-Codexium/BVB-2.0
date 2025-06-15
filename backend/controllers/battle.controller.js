import {Battle} from '../models/battle.model.js'
import { Rapper } from '../models/rapper.model.js'
import { sendEmail } from '../sendemail.js';

export const createBattle = async ( req,res) =>{
    try{
        const {rapper2Id,timeLimit,battleDate} = req.body;
        const rapper1Id = req.rapper._id;
         // to be check based on authentication
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


    // notify the rapper2 throught email

      const subject=`you have been challended from ${rapper1.username}`;
      const emailbody=`
          <h2>🔥 Rap Battle Challenge Incoming! 🔥</h2>
          <p>Hey ${rapper2.username},</p>
          <p><strong>${rapper1.username}</strong> has challenged you to a rap battle!</p>
          <p> <b>Log in</b> to the website to accept or decline the challenge</p>
          <a href="url" </a>
           <p>🎤 Stay lyrical,<br>BarsVsBars Team</p>
      `
      try {
          sendEmail(rapper2.email,subject,emailbody)
        
      } catch (error) {
        console.log("email error in creating battle ")
        console.error(error)

      }


      //email sent code completed

       const populatedBattle = await Battle.findById(savedBattle._id)
      .populate('contestants.rapper1', 'username fullName email rank')
      .populate('contestants.rapper2', 'username fullName email rank');

      console.log(populatedBattle);
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


export const acceptBattle = async (req, res) => {
  try{
    const {battleId} = req.params;
    const rapperId = req.rapper._id;
    
    // find the battle
    const battle = await Battle.findById(battleId)
    .populate('contestants.rapper1', 'username fullName email rank')
    .populate('contestants.rapper2', 'username fullName email rank');
    
    

    // check if battle exists
    if(!battle){
      return res.status(404).json({
        success:false,
        message:'Battle not found'
      })
    }

    // check if battle is already accepted
    if(battle.status !== 'pending'){
      return res.status(400).json({
        success:false,
        message:'Battle is not pending'
      })
    }

    // check if user is a contestant
    const isContestant = battle.contestants.rapper2.toString() === rapperId.toString();
    if(!isContestant){
      return res.status(403).json({
        success:false,
        message:'You are not a contestant in this battle'
      })
    }
      //emial to the rapper1 for notifying that challenget is accepted

        //to get the detail of rapper1 and rapper2 in the particular battle
        // we need to get the detail of rapper1 and rapper which we have populated earlie
        const subject=`your challenge is accepte by ${battle.contestants.rapper2.username}`
        const emailbody=`
         <h2>🔥 Rap Battle Challenge Incoming! 🔥</h2>
          <p>Hey ${battle.contestants.rapper1.username}</p>
          <p><strong>${battle.contestants.rapper2.username}</strong> has accepted your challenge</p>
          <p> <b>Log in</b> to the website to accept or decline the challenge</p>
          <a href="url of login page" </a>
           <p>🎤 Stay lyrical,<br>BarsVsBars Team</p>

        `
        try {
          
          sendEmail(battle.contestants.rapper1.equals,subject,emailbody)
          
        } catch (error) {
           console.log("email error in accepting battle ")
            console.error(error)

        }
  
      //email sent code completed
    const updatedBattle = await Battle.findByIdAndUpdate(
      battleId,
      { status: 'active' },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Battle accepted successfully',
      data: updatedBattle
    })

  } catch (error) {
    console.error('Error accepting battle:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while accepting battle'
    });
  }
}

export const handleTimeLimitExpiration = async (req, res) => {
  try {
    const { battleId } = req.params;
    
    // Find the battle
    const battle = await Battle.findById(battleId);
    
    if (!battle) {
      return res.status(404).json({
        success: false,
        message: 'Battle not found'
      });
    }

    // Check if battle is active
    if (battle.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Battle is not active'
      });
    }

    // Calculate if time limit has expired
    const battleStartTime = new Date(battle.battleDate);
    const currentTime = new Date();
    const timeElapsed = (currentTime - battleStartTime) / 1000; // Convert to seconds

    if (timeElapsed < battle.timeLimit) {
      return res.status(400).json({
        success: false,
        message: 'Time limit has not expired yet',
        remainingTime: battle.timeLimit - timeElapsed
      });
    }

    // Determine winner based on submissions
    let winner = null;
    const rapper1Submission = battle.verses.rapper1.text && battle.verses.rapper1.audio;
    const rapper2Submission = battle.verses.rapper2.text && battle.verses.rapper2.audio;

    if (rapper1Submission && !rapper2Submission) {
      winner = battle.contestants.rapper1;
    } else if (!rapper1Submission && rapper2Submission) {
      winner = battle.contestants.rapper2;
    } else if (!rapper1Submission && !rapper2Submission) {
      winner = 'draw'; // Both failed to submit
    }
    // If both submitted, winner will be determined by voting/judging system
    // You can add additional logic here for judging criteria

    // Update battle status and handle incomplete submissions
    const updatedBattle = await Battle.findByIdAndUpdate(
      battleId,
      {
        status: 'completed',
        winner: winner,
        $set: {
          'verses.rapper1.text': battle.verses.rapper1.text || 'No submission',
          'verses.rapper2.text': battle.verses.rapper2.text || 'No submission',
          'verses.rapper1.audio': battle.verses.rapper1.audio || '',
          'verses.rapper2.audio': battle.verses.rapper2.audio || '',
          endTime: currentTime
        }
      },
      { new: true }
    ).populate('contestants.rapper1', 'username fullName email rank')
     .populate('contestants.rapper2', 'username fullName email rank')
     .populate('winner', 'username fullName email rank');

    return res.status(200).json({
      success: true,
      message: 'Battle time limit expired and status updated',
      data: updatedBattle
    });

  } catch (error) {
    console.error('Error handling time limit expiration:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while handling time limit expiration'
    });
  }
};
export const getBattleById = async (req, res) => {
  try{
    const {battleId} = req.params;
    const battle = await Battle.findById(battleId);

    if(!battle){
      return res.status(404).json({
        success:false,
        message:'Battle not found'
      })
    }
    
    return res.status(200).json({
      success:true,
      message:'Battle found',
      data:battle
    })
    
  } catch (error) {
    console.error('Error getting battle by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting battle by ID'
    });
  }
}


export const getBattleByRapperId = async (req, res) => {
  try{
    const {rapperId} = req.params;
    const battles = await Battle.find({
      'contestants.rapper1': rapperId
    }).populate('contestants.rapper1', 'username fullName email rank')
    .populate('contestants.rapper2', 'username fullName email rank')
    .populate('winner', 'username fullName email rank');

    return res.status(200).json({
      success:true,
      message:'Battles found',
      data:battles
    })
    
  } catch (error) {
    console.error('Error getting battles by rapper ID:', error);
    res.status(500).json({
      success:false,  
      message:'Internal server error while getting battles by rapper ID'
    })
  }
}


export const getAllBattles = async (req, res) => {
  try{
    const battles = await Battle.find()
    .populate('contestants.rapper1', 'username fullName email rank')
    .populate('contestants.rapper2', 'username fullName email rank')
    .populate('winner', 'username fullName email rank');

    return res.status(200).json({
      success:true,
      message:'All battles found',
      data:battles
    })

  } catch (error) {
    console.error('Error getting all battles:', error);
    res.status(500).json({
      success:false,
      message:'Internal server error while getting all battles'
    })
  }
}

export const getBattleByStatus = async (req, res) => {
  try{
    const {status} = req.params;
    const battles = await Battle.find({status:status})
    .populate('contestants.rapper1', 'username fullName email rank')
    .populate('contestants.rapper2', 'username fullName email rank')
    .populate('winner', 'username fullName email rank');

    return res.status(200).json({
      success:true,
      message:'Battles found',
      data:battles
    })

  } catch (error) {
    console.error('Error getting battles by status:', error);
    res.status(500).json({
      success:false,
      message:'Internal server error while getting battles by status'
    })
  }
}

