const Order = require("../db/models/orderModel")
const jwt = require("jsonwebtoken");
require('../index.js'); //dangerous?

const { notifHandler, notifStub } = require("../utils/notification")


//fetch Orders endpoint
module.exports.getOrders = async (req,res) => {
  const vendorId = req.params.resId
  Order.find({restID: vendorId,status: { $in: ["pending", "confirm"] }}).then((docs) => {
      res.status(200).send(docs)
  }).catch((error)=>{
      res.status(400).send(
          
          {
              message: "Could not fetch orders.",
              error: error
          }
      )
      }
      
  )
}
module.exports.getCompletedOrders = async (req,res) => {
  const vendorId = req.params.resId
  Order.find({restID: vendorId,status: { $in: ["completed"] }}).then((docs) => {
      res.status(200).send(docs)
  }).catch((error)=>{
      res.status(400).send(
          
          {
              message: "Could not fetch orders.",
              error: error
          }
      )
      }
      
  )
}
module.exports.orderHistory = async (req,res) => {
  const userId = req.params.userId;
  Order.find({userID: userId}).then((docs) => {
      res.status(200).send(docs)
  }).catch((error)=>{
      res.status(400).send(
          {
              message: "Could not fetch orders.",
              error: error
          }
      )
      }  
  )
}

//status update endpoint for restaurant
module.exports.statusUpdate = async (req,res) => {
  const orderID = req.body.orderID;
  const status = req.body.status;
  if(status === "confirm" || status === "denied" || status === "completed"){
      Order.updateOne({
        "_id" : orderID
      },{
        $set:{
          status:status
        }

      }).then((result)=>{
        res.status(201).send({
          message: "status updated",
          result,
        });
      }).catch((error)=>{
        res.status(400).send(
          
          {
              message: "Could not update order status",
              error: error
          }
      )
      })
  }
  else{
    res.status(400).send({
      message: "not valid field for status (confirm/denied/completed)"
    });
}
}

//place order endpoint
module.exports.placeOrder = async (req, res, next) => {
  try {
    const token = req.body.token

    //for testing purpose : 
    // const decodedToken = {"id" : 1,
    //                       "userRole": "user"
    //                     };
    const userID = token.id
    const userRole = token.userRole
    const items = req.body.items;
    const instructions = req.body.instruction;
    const paymentMode = req.body.paymentMode;
    const restID = req.body.restID;
    const phone = req.body.phone;
    const fullName=req.body.fullName;
    const address=req.body.address;

    let order;

    if(userRole!=="user"){
      return res.status(400).send({
        message: "Only customers can place orders!"
      })
    }
    const orderObj = {
      userID : userID,
      items: items,
      instruction: instructions,
      paymentMode: paymentMode,
      restID : restID,
      status : "pending",
      phone:phone,
      fullName:fullName,
      address:address
    };
    console.log(orderObj);
    order = await Order.create(orderObj);
    await order.save()
              .then((result)=>{
                //send the notification through sockets
                mySocket = rest_sockets[restID];
                if(mySocket){
                  mySocket.emit("receive_order", {orderID : result._id});
                }
                else{
                  throw "Socket does not exist";
                }
                
                res.status(201).send({
                          message: "Order placed.",
                          result,
                        });
              })
              .catch((error)=>{
                console.log(error)
                res.status(500).send({
                        message: "Error placing the order",
                        error,
                      });
              });
  } catch(error) {
    res.status(500).send({
      message: "issue occured.",
      error,
    })
  }
  };



