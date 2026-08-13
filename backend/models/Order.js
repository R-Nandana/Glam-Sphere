const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    shade: String,
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],

    shippingAddress: {
      name: String,
      line1: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      phone: String,
    },

    coupon: {
      code: String,
      discount: Number,
    },

    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["razorpay", "stripe", "cod"], default: "razorpay" },
    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
