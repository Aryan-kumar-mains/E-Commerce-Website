const Order = require("../models/orderModel")
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Create New Order
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    })
})



// Get Single order details
exports.getSingleOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id)
    .populate("user", "name email");  // used to get the name and email of the user who created the order

    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    })
})



// Get logged in user order
exports.myOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({user: req.user._id})


    res.status(200).json({
        success: true,
        orders,
    })
})



// Get all orders  -- admin
exports.getAllOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });


    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})


// Update Order Status -- admin
exports.updateOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
    })

    order.orderStatus = req.body.status;

    if(req.body.staus === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave: false});


    res.status(200).json({
        success: true,
        order,
    })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({validateBeforeSave: false})
}



// Delete orders  -- Admin
exports.deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    
    if(!order){
        return next(new ErrorHandler("Order not found with this Id", 404));
    }
    
    await order.deleteOne();

    res.status(200).json({
        success: true,
    })
})