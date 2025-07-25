import { Vote } from "../models/vote.model.js";
import { Battle } from "../models/battle.model.js";

export const addVote = async (req, res) => {
  try {
    const { battleId, voterId, whom } = req.body;

    if (!battleId || !voterId || !whom) {
      return res.status(400).json({ success: false, message: "Invalid input" });
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
    const whomVoted = whom === 1 ? battle.rapper1 : battle.rapper2;

    let vote = await Vote.findOne({ battleId, voterId });

    if (vote && vote.votedfor && vote.votedfor.equals(whomVoted)) {
      // Toggle off: remove vote
      if (whom === 1) battle.rapper1Votes--;
      else battle.rapper2Votes--;
      vote.votedfor = undefined;
      await vote.save();
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
    return res.status(200).json({
      success: true,
      message: "Vote submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Network error in increase vote controller",
    });
  }
};