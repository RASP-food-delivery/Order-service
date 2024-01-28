const Order = require("../db/models/orderModel")
const jwt = require("jsonwebtoken");

const { notifHandler } = require("../utils/notification")


//place order endpoint
module.exports.placeOrder = async (req, res, next) => {
  try {

    const token = req.body.token

    // const decodedToken = jwt.decode(token, "RANDOM-TOKEN");

    //for testing purpose : 
    const decodedToken = {"id" : 1,
                          "userRole": "user"
                        };
    
    const userID = decodedToken.id
    const userRole = decodedToken.userRole
    if(userRole==="vendor"){
      return res.status(400).send({
        message: "Only customers can place orders!"
      })
    }
    
    
      const items = req.body.items;
      // console.log(items)
    
    // console.log(typeof items)
    
    const instructions = req.body.instructions;
    const payementMode = req.body.payementMode;
    const restID = req.body.restID;
    let order;
    console.log(req.body)
    order = await Order.create({
                userID : userID,
                items: items,
                instruction: instructions,
                payementMode: payementMode,
                restID : restID,
              });
    await order.save()
              .then((result)=>{
                notifHandler(result._id, restID);
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



