import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems: [
        {
            name: {type: String, requierd: true},
            quantity: {type: Number, requierd: true},
            image: {type: String, requierd: true},
            price: {type: Number, requierd: true},
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
        }
    ],
    shippingAdress: {
        adress: {type: String, requierd: true},
        city: {type: String, requierd: true},
        postalCode: {type: String, requierd: true},
        country: {type: String, requierd: true},
    },
    paymentMethode: {
        type: String,
        required: true
    },
    paymentResult: {
        id: {type: String},
        status: {type: String},
        update_time: {type: String},
        email_adress: {type: String},
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    PaidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliverdAt: {
        type: Date,
    },
}, {
    timestamps: true
})

const Order = mongoose.model("Order", orderSchema)

export default Order