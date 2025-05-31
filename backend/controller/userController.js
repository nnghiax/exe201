const User = require('../model/User')



const userController = {

    countUser: async (req, res) => {
        try {
            const countUser = await User.countDocuments();
            return res.status(200).json({ count: countUser })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    listUser: async (req, res) => {
        try {
            const user = await User.find();
            const result = user.map((u) => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role,
                address: u.address,
                avatar: u.avatar
            }));
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }


}


module.exports = userController