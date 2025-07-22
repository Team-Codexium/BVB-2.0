import { Rapper } from "../models/rapper.model.js";
import { Battle } from "../models/battle.model.js";

// Get all rappers (with pagination and search)
export const getAllRappers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Rapper.countDocuments(query);
    const rappers = await Rapper.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: rappers,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rappers",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get a single rapper by ID
// export const getRapperById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const rapper = await Rapper.findById(id);
//     if (!rapper) {
//       return res.status(404).json({
//         success: false,
//         message: "Rapper not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       data: rapper,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch rapper",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// Update a rapper (profile update)
export const updateRapper = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Optionally: prevent updating sensitive fields like password here
    delete updateData.password;

    const updatedRapper = await Rapper.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedRapper) {
      return res.status(404).json({
        success: false,
        message: "Rapper not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedRapper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update rapper",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete a rapper
export const deleteRapper = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Rapper.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Rapper not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Rapper deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete rapper",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// profile of LoggedIn Rapper
export const getLoggedInRapperProfile = async (req, res) => {
  try {
    // Get the logged-in rapper's ID from the JWT token or session
    const rapperId = req.user._id;

    // Get rapper's basic information
    const rapper = await Rapper.findById(rapperId)
      .select("-password")
      .populate("battlesParticipated", "status winner contestants battleDate");

    if (!rapper) {
      return res.status(404).json({
        success: false,
        message: "Rapper not found",
      });
    }

    // Get all battles where this rapper is a participant
    const battles = await Battle.find({
      $or: [
        { "rapper1": rapperId },
        { "rapper2": rapperId },
      ],
    })
      .populate("rapper1", "username image fullName rank")
      .populate("rapper2", "username image fullName rank")
      .populate("winner", "username image")
      .populate("voting.voters.user", "username image")
      .sort({ createdAt: -1 });

    // Categorize battles based on status and outcome
    const battleStats = {
      won: [],
      lost: [],
      pending: [],
      active: [],
      draw: [],
      total: battles.length,
    };

    battles.forEach((battle) => {
      const isRapper1 = battle.rapper1._id.toString() === rapperId;
      const isRapper2 = battle.rapper2._id.toString() === rapperId;

      switch (battle.status) {
        case "pending":
          battleStats.pending.push(battle);
          break;

        case "active":
          battleStats.active.push(battle);
          break;

        case "completed":
          // Determine if rapper won or lost
          if (battle.winner) {
            if (battle.winner._id.toString() === rapperId) {
              battleStats.won.push(battle);
            } else {
              battleStats.lost.push(battle);
            }
          } else {
            // If no winner declared, consider it a draw or still pending
            battleStats.draw.push(battle);
          }
          break;

        // case 'cancelled':
        //   // Add cancelled battles to pending for display purposes
        //   battleStats.pending.push(battle);
        //   break;

        case "pending":
          battleStats.pending.push(battle);
      }
    });

    // Calculate additional stats
    const stats = {
      totalBattles: battles.length,
      wonBattles: battleStats.won.length,
      lostBattles: battleStats.lost.length,
      drawBattles: battleStats.draw.length,
      pendingBattles: battleStats.pending.length,
      activeBattles: battleStats.active.length,
      winRate:
        battles.length > 0
          ? ((battleStats.won.length / battles.length) * 100).toFixed(1)
          : 0,
      currentRank: rapper.rank,
      battlesParticipated: rapper.battlesParticipated.length,
    };

    // Get recent activity (last 10 battles)
    const recentBattles = battles.slice(0, 10);

    // Response data
    const profileData = {
      rapper: {
        id: rapper._id,
        username: rapper.username,
        email: rapper.email,
        fullName: rapper.fullName,
        image: rapper.image,
        rank: rapper.rank,
        isRapper: rapper.isRapper,
        joinedAt: rapper.createdAt,
        updatedAt: rapper.updatedAt,
      },
      battles: battleStats,
      stats,
      recentActivity: recentBattles,
    };

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching rapper profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// profile of Rapper
export const getRapperProfile = async (req, res) => {
  try {
    // Get the logged-in rapper's ID from the JWT token or session

    const { id: rapperId } = req.params;

    // Validate rapper ID format
    if (!rapperId || !rapperId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid rapper ID format",
      });
    }

    // Get rapper's basic information
    const rapper = await Rapper.findById(rapperId)
      .select("-password")
      .populate("battlesParticipated", "status winner contestants battleDate");

    if (!rapper) {
      return res.status(404).json({
        success: false,
        message: "Rapper not found",
      });
    }

    // Get all battles where this rapper is a participant
    const battles = await Battle.find({
      $or: [
        { "contestants.rapper1": rapperId },
        { "contestants.rapper2": rapperId },
      ],
    })
      .populate("contestants.rapper1", "username image fullName rank")
      .populate("contestants.rapper2", "username image fullName rank")
      .populate("winner", "username image")
      .populate("voting.voters.user", "username image")
      .sort({ createdAt: -1 });

    // Categorize battles based on status and outcome
    const battleStats = {
      won: [],
      lost: [],
      pending: [],
      active: [],
      draw: [],
      total: battles.length,
    };

    battles.forEach((battle) => {
      const isRapper1 = battle.rapper1._id.toString() === rapperId;
      const isRapper2 = battle.rapper2._id.toString() === rapperId;

      switch (battle.status) {
        case "pending":
          battleStats.pending.push(battle);
          break;

        case "active":
          battleStats.active.push(battle);
          break;

        case "completed":
          // Determine if rapper won or lost
          if (battle.winner) {
            if (battle.winner._id.toString() === rapperId) {
              battleStats.won.push(battle);
            } else {
              battleStats.lost.push(battle);
            }
          } else {
            // If no winner declared, consider it a draw or still pending
            battleStats.draw.push(battle);
          }
          break;

        // case 'cancelled':
        //   // Add cancelled battles to pending for display purposes
        //   battleStats.pending.push(battle);
        //   break;

        case "pending":
          battleStats.pending.push(battle);
      }
    });

    // Calculate additional stats
    const stats = {
      totalBattles: battles.length,
      wonBattles: battleStats.won.length,
      lostBattles: battleStats.lost.length,
      drawBattles: battleStats.draw.length,
      pendingBattles: battleStats.pending.length,
      activeBattles: battleStats.active.length,
      winRate:
        battles.length > 0
          ? ((battleStats.won.length / battles.length) * 100).toFixed(1)
          : 0,
      currentRank: rapper.rank,
      battlesParticipated: rapper.battlesParticipated.length,
    };

    // Get recent activity (last 10 battles)
    const recentBattles = battles.slice(0, 10);

    // Response data
    const profileData = {
      rapper: {
        id: rapper._id,
        username: rapper.username,
        email: rapper.email,
        fullName: rapper.fullName,
        image: rapper.image,
        rank: rapper.rank,
        isRapper: rapper.isRapper,
        joinedAt: rapper.createdAt,
        updatedAt: rapper.updatedAt,
      },
      battles: battleStats,
      stats,
      recentActivity: recentBattles,
    };

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching rapper profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
