const mongoose = require("mongoose");
// ofMixed: [Schema.Types.Mixed],


// Orders schema

const OrderSchema = new mongoose.Schema({
  //userID  
  userID: {
      type: String,
      required: [true, "User ID is required"],
      unique: false
  },
  //menu items
  items: [{
    orderid: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  // instructions field
  instruction: {
    type: String,
    required : false,
    unique: false,
  },
  
  // payement type field
    payementMode: {
      type: String,
      required: [true, "No payement mode specified."],
      unique: false,
    },
    
  // rest ID field
  restID: {
    type: String,
    required: [true, "restaurant ID is required"],
    unique: false,
  },

  
});

// export OrderSchema
module.exports = mongoose.model.Orders || mongoose.model("Orders", OrderSchema);

