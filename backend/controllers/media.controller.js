
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

   const {title} = req.body;

    if (!battleId || !rapperId) {
      return res.status(400).json({
        success: false,
        message: "Battle ID and Rapper ID are required"
      });
    }
    let battle = await Battle.findById(battleId);
    if(!battle)
    {
      return res.status(400).json(
        {
          success:false,
          message:"Battle not found"
        }
      )
    }
    const israpper1=battle.rapper1.toString()===rapperId;
    const israpper2=battle.rapper2.toString()===rapperId;

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
    console.log("audio uploaded to Cloudinary successfully");
    console.log(cloud_res);

    if(israpper1) {battle.rapper1Tracks.push({title, url:cloud_res.secure_url});}
    else battle.rapper2Tracks.push({title, url:cloud_res.secure_url});
    const updatedBattle = await battle.save();
      if(!updatedBattle)
      {
        return res.status(400).json(
          {
            success:false,
            message:"Failed to update battle"
          }
        )
      }
    console.log("Battle updated with audio URL");

    


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

export const getAudioFromBattle=async(req,res)=>
{
  try
  {
    const { battleId, rapperId } = req.params;
    if (!battleId || !rapperId) {
      return res.status(400).json({
        success: false,
        message: "Battle ID and Rapper ID are required"
      });
    }
    const battle =await Battle.findOne(battleId)
    if(!battle)
    {
      return res.status(400).json(
        {
          success:false,
          message:"Battle not found"
        }
      )
    } 
    const israpper1=battle.rapper1.toString()===rapperId;
    const israpper2=battle.rapper2.toString()===rapperId;
    if(!israpper1 && !israpper2)
    {
      return res.status(400).json(
        {
          success:false,
          message:"Rapper not part of the battle"
        }
      )
    }
   
    let audioUrls = [];
    if(israpper1) audioUrls = battle.rapper1Tracks;
    else audioUrls = battle.rapper2Tracks;

      res.status(201).json(
        {
          success:true,
          audioUrls:audioUrls
        }
      )
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get audio from battle",
    });
  }
}

export const deleteAudioFromBattle=async(req,res)=>
{
    try
    {
        const { battleId, rapperId, index } = req.params;
        if(!battleId || !rapperId || !index)
        {
          return res.status(400).json({
            success: false,
            message: "Battle ID, Rapper ID and Audio Index are required"
          });
        }
        const battle = await Battle.findOne(battleId);
        if (!battle) {
          return res.status(400).json({
            success: false,
            message: "Battle not found"
          });
        }

        const isRapper1 = battle.rapper1.toString() === rapperId;
        const isRapper2 = battle.rapper2.toString() === rapperId;

        if (!isRapper1 && !isRapper2) {
          return res.status(400).json({
            success: false,
            message: "Rapper not part of the battle"
          });
        }
        let audioUrls = [];
        if (isRapper1) audioUrls = battle.rapper1Tracks;
        else audioUrls = battle.rapper2Tracks;

        if (index < 0 || index >= audioUrls.length) {
          return res.status(400).json({
            success: false,
            message: "Invalid audio index"
          });
        }

        audioUrls.splice(index, 1);

        if(isRapper1) battle.rapper1Tracks = audioUrls;
        else battle.rapper2Tracks = audioUrls;

       const  battleres= battle.save()
      if(!battleres)
      {
        return res.status(400).json({
          success: false,
          message: "Failed to update battle"
        });
      }

        res.json({
          success: true,
          message: "Audio deleted successfully",
          data: audioUrls
        });
      
    }
    catch(error)
    {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Failed to delete audio from battle",
      });
    }
}