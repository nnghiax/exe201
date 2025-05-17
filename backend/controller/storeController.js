const Store = require('../model/Store')


const storeController = {

    detailStore: async (req, res) => {
        try {
            const storeId = req.params.storeId

            const store = await Store.findById(storeId)
            if (!store) {
                return res.status(404).json({ message: 'Store not found' })
            }
            const result = {
                name: store.name,
                description: store.description,
                address: store.address,
                phone: store.phone,
                image: store.image
            }
            return res.status(200).json({ data: result })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    },

    updateInforStore: async(req, res) => {
        try {
            const storeId = req.params.storeId
            const userId = req.userId
            const {name, description, address, phone, image} = req.body

            const store = await Store.findById(storeId)
            if(!store){
                return res.status(404).json({ message: 'Store not found' })
            }

            if(userId !== store.userId.toString()){
                return res.status(403).json({message: 'You are not authorized to update this store'})
            }

            const updateFields = {}
            if(name !== undefined) updateFields.name = name
            if(description !== undefined) updateFields.description = description
            if(address !== undefined) updateFields.address = address
            if(phone !== undefined) updateFields.phone = phone
            if(image !== undefined) updateFields.image = image

            const updateStore = await Store.findByIdAndUpdate(
                storeId,
                updateFields,
                {new: true}
            )
            return res.status(200).json({message: 'Update store successfully', data: updateStore})
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}


module.exports = storeController