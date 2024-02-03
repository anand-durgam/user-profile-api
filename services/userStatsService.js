const User = require("../models/user.model");

const getUserStatistics = async () => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          averageAge: { $avg: "$age" },
          usersByCountry: {
            $push: {
              country: "$country",
              count: 1,
            },
          },
        },
      },
      {
        $unwind: "$usersByCountry",
      },
      {
        $group: {
          _id: "$usersByCountry.country",
          count: { $sum: "$usersByCountry.count" },
        },
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: "$count" },
          averageAge: { $avg: "$age" },
          usersByCountry: { $push: { country: "$country", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 0,
          totalUsers: 1,
          averageAge: 1,
          usersByCountry: 1,
        },
      },
    ]);

    return stats[0] || {};
  } catch (error) {
    console.log(`Error getting user statistics: ${error.message}`);
  }
};

module.exports = { getUserStatistics };
