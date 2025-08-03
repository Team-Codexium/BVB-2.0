import { Vote } from "../models/vote.model.js";
import { Battle } from "../models/battle.model.js";
import { emitVoteUpdate } from "../socket.js"
export const addVote = async (req, res) => {
  try {
    const { battleId } = req.params;
    const voterId = req.rapper._id; 
    const { rapperId } = req.body;
  
    console.log("=== VOTE SUBMISSION DEBUG ===");
    console.log("Received vote for battle:", battleId, "by voter:", voterId, "for rapper:", rapperId);
    console.log("Request body:", req.body);
    console.log("Request params:", req.params);
    console.log("User from JWT:", req.rapper);
    console.log("rapperId type:", typeof rapperId, "value:", rapperId);
    if (!battleId || !voterId) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    
    // Allow rapperId to be null for vote removal
    if (rapperId === undefined || rapperId === '') {
      return res.status(400).json({ success: false, message: "Rapper ID is required" });
    }
    const battle = await Battle.findById(battleId);
    if (!battle) {
      return res
        .status(400)
        .json({ success: false, message: "Battle not found" });
    }
    if(battle.status!=="active")
    {
      return res.status(400).json({success:false,message:"you can not vote battle is ended"});
    }
    // Handle vote removal (rapperId is null)
    if (rapperId === null) {
      let vote = await Vote.findOne({ battleId, voterId });
      if (vote && vote.votedfor) {
        // Remove existing vote
        const whom = battle.rapper1.equals(vote.votedfor) ? 1 : 2;
        if (whom === 1) battle.rapper1Votes--;
        else battle.rapper2Votes--;
        vote.votedfor = undefined;
        await vote.save();
        
        const updatedBattle = await battle.save();
        
        // Emit real-time vote update
        emitVoteUpdate(battleId, {
          rapper1Votes: updatedBattle.rapper1Votes,
          rapper2Votes: updatedBattle.rapper2Votes,
          voterId: voterId.toString(),
          votedFor: null
        });
        
        return res.status(200).json({
          success: true,
          message: "Vote removed successfully",
          updatedVotes: {
            rapper1Votes: updatedBattle.rapper1Votes,
            rapper2Votes: updatedBattle.rapper2Votes
          },
          votedFor: null
        });
      } else {
        // No vote to remove
        return res.status(200).json({
          success: true,
          message: "No vote to remove",
          updatedVotes: {
            rapper1Votes: battle.rapper1Votes,
            rapper2Votes: battle.rapper2Votes
          },
          votedFor: null
        });
      }
    }

    // Handle vote addition/switch
    const whomVoted = rapperId
    const whom = battle.rapper1.equals(whomVoted) ? 1 : 2;

    let vote = await Vote.findOne({ battleId, voterId });

    let voteRemoved = false;
    let finalVotedFor = rapperId;

    if (vote && vote.votedfor && vote.votedfor.equals(whomVoted)) {
      // Toggle off: remove vote
      console.log("Removing vote for rapper:", whomVoted);
      if (whom === 1) battle.rapper1Votes--;
      else battle.rapper2Votes--;
      vote.votedfor = undefined;
      await vote.save();
      voteRemoved = true;
      finalVotedFor = null; // Indicate vote was removed
      console.log("Vote removed, finalVotedFor set to null");
    } else if (vote && vote.votedfor) {
      // Switch vote
      if (vote.votedfor.equals(battle.rapper1)) {
        battle.rapper1Votes--;
        battle.rapper2Votes++;
      } else if (vote.votedfor.equals(battle.rapper2)) {
        battle.rapper2Votes--;
        battle.rapper1Votes++;
      }
      vote.votedfor = whomVoted;
      await vote.save();
    } else if (vote) {
      // No previous vote, just add
      if (whom === 1) battle.rapper1Votes++;
      else battle.rapper2Votes++;
      vote.votedfor = whomVoted;
      await vote.save();
    } else {
      // First time voting
      if (whom === 1) battle.rapper1Votes++;
      else battle.rapper2Votes++;
      vote = new Vote({ battleId, voterId, votedfor: whomVoted });
      await vote.save();
    }

    const updatedBattle = await battle.save();
    if (!updatedBattle) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update battle" });
    }
    
    // Emit real-time vote update to battle room
    console.log("Emitting vote update with votedFor:", finalVotedFor);
    emitVoteUpdate(battleId, {
      rapper1Votes: updatedBattle.rapper1Votes,
      rapper2Votes: updatedBattle.rapper2Votes,
      voterId: voterId.toString(),
      votedFor: finalVotedFor
    });
    
    return res.status(200).json({
      success: true,
      message: voteRemoved ? "Vote removed successfully" : "Vote submitted successfully",
      updatedVotes: {
        rapper1Votes: updatedBattle.rapper1Votes,
        rapper2Votes: updatedBattle.rapper2Votes
      },
      votedFor: finalVotedFor
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Network error in increase vote controller",
    });
  }
};

export const checkVote = async (req, res) => {
  try {
    const { battleId } = req.params;
    console.log("battle id in check vote controller",battleId);
    const voterId = req.rapper._id;
    console.log("voterid = ",voterId);
    if (!battleId) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const vote = await Vote.findOne({ battleId, voterId }).populate("voterId", "name");
    // if (!vote) {
    //   return res.status(200).json({ success: true, message: "Vote not found" ,vote});
    // }

    return res.status(200).json({
      success: true,
      vote,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Network error in get votes controller",
    });
  }
}