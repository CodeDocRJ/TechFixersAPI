const mongoose = require( 'mongoose' );

const repairCategorySchema = new mongoose.Schema(
    {
        applianceName: {
            type: String,
            required: true,
        },
        applianceImage: {
            type: String,
            required: false,
        },
        approxPrice: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: false,
        }
    }, {
    timestamps: true
}
);

const RepairCategoryModel = mongoose.model( 'RepairCategory', repairCategorySchema );

module.exports = RepairCategoryModel;