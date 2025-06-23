import { Rapper } from '../models/rapper.model.js';

// Get all rappers (with pagination and search)
export const getAllRappers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
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
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rappers',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get a single rapper by ID
export const getRapperById = async (req, res) => {
  try {
    const { id } = req.params;
    const rapper = await Rapper.findById(id);
    if (!rapper) {
      return res.status(404).json({
        success: false,
        message: 'Rapper not found'
      });
    }
    res.status(200).json({
      success: true,
      data: rapper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rapper',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update a rapper (profile update)
export const updateRapper = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // Optionally: prevent updating sensitive fields like password here
    delete updateData.password;

    const updatedRapper = await Rapper.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedRapper) {
      return res.status(404).json({
        success: false,
        message: 'Rapper not found'
      });
    }
    res.status(200).json({
      success: true,
      data: updatedRapper
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update rapper',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
        message: 'Rapper not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Rapper deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete rapper',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
