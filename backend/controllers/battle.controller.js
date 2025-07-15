import {Battle} from '../models/battle.model.js'
import { Rapper } from '../models/rapper.model.js'
import { sendEmail } from '../utils/sendEmail.js';


export const createBattle = async ( req,res) =>{
    try{
        const {rapper2Id,battleDate} = req.body;
        const rapper1Id = req.rapper._id;
         // to be check based on authentication
        // Validation if rapper 2 is not present
        const timeLimit = 1440; // 1 day
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
    const rapper2Id = req.rapper._id;
    //considering the rapper1 is one who create the battle and rapper2 is the one whp 
    //accept the battle
    
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
    // console.log(battle.contestants.rapper2._id.toString()) //686abcfb2f4bd372be0e86e0
    // console.log(rapper2Id.toString()) //686abcfb2f4bd372be0e86e0
    
    const isContestant = battle.contestants.rapper2._id.toString() === rapper2Id.toString();
    if(!isContestant){
      return res.status(403).json({
        success:false,
        message:'You are not a contestant in this battle'
      })
    }
      const username1=battle.contestants.rapper1.username;//username of the rapper1
      const username2=battle.contestants.rapper2.username;//username of the rapper2
      //emial to the rapper1 for notifying that challenget is accepted

        //to get the detail of rapper1 and rapper2 in the particular battle
        // we need to get the detail of rapper1 and rapper which we have populated earlie
        const subject=`your challenge is accepte by ${username2}`
        const emailbody=`
         <h2>🔥 Rap Battle Challenge Incoming! 🔥</h2>
          <p>Hey ${username1}</p>
          <p><strong>${username2}</strong> has accepted your challenge</p>
          <p> <b>Log in</b> to the website to accept or decline the challenge</p>
          <a href="url of login page" </a>
           <p>🎤 Stay lyrical,<br>BarsVsBars Team</p>

        `
        try {
          
          sendEmail(battle.contestants.rapper1.email,subject,emailbody)
          
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
//handletime limit expiration


export const getBattleById = async (req, res) => {
  //this controller to be used to get the battle deatils 
  //when some click on battle card 
  try{
    const {battleId} = req.params;
    const battle = await Battle.findById(battleId)
    .populate('contestants.rapper1', 'username fullName email rank image')
    .populate('contestants.rapper2', 'username fullName email rank image')
    
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
  // this controller to be used for displaying the 
  //my battles page of current rapper thorugh his id
  try{
    const {rapperId} = req.params;
    const battles = await Battle.find({
      $or: [
        { 'contestants.rapper1': rapperId },
        { 'contestants.rapper2': rapperId }
      ]}).populate('contestants.rapper1', 'username fullName email rank')
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
  //use for battle card for getting all battles
  //this to be used in diplaying battle card in explore battles
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

export const getQueryBattle = async (req, res) => {
  const { limit = 20, page = 1, sort = 'createdAt', status } = req.query;
  const query = status ? { status } : {};
  const battles = await Battle.find(query)
    .sort({ [sort]: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Battle.countDocuments(query);
  res.json({
    battles,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
  });
}