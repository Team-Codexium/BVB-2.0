import { connectCloudinary } from '../config/connectCloudinary.js';
import { v2 as Cloudinary } from 'cloudinary';
import multer from 'multer';
import {Battle} from "../models/battle.model.js"
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const addAudioToBattle = async (req, res) => {
  try {
    console.log("Adding audio to battle");

    /*{
      verify the battle and rapperrr
    }*/
   const { battleId, rapperId } = req.params ;
    if (!battleId || !rapperId) {
      return res.status(400).json({
        success: false,
        message: "Battle ID and Rapper ID are required"
      });
    }
    const battle =await Battle.findOne(battleId);
    if(!battle)
    {
      return res.status(400).json(
        {
          success:false,
          message:"Battle not found"
        }
      )
    }
    const israpper1=battle.contestants.rapper1.toString()===rapperId;
    const israpper2=battle.contestants.rapper2.toString()===rapperId;

    if(!israpper1 && !israpper2)
    {
      return res.status(400).json(
        {
          success:false,
          message:"Rapper not part of the battle"
        }
      )
    }

   //every thinng is fine now  upload the audio 

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const cloud_res = await Cloudinary.uploader.upload(dataUri, {
      folder: "battle-audio",
      resource_type: 'video'
    });

    if(israpper1) battle.rapper1_audio_urls.push({url:cloud_res.secure_url});
    else battle.rapper2_audio_urls.push({url:cloud_res.secure_url});



    console.log("audio uploaded to Cloudinary successfully");
    console.log(cloud_res);


    res.json({
      success: true,
      audioUrl:cloud_res
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add audio to battle",
     
    });


  }
};
