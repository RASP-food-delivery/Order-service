const Order = require("../db/models/orderModel")
const jwt = require("jsonwebtoken");
require('../index.js'); //dangerous?

const { notifHandler, notifStub } = require("../utils/notification")


//fetch Orders endpoint
module.exports.getOrders = async (req,res) => {
  
  // const token = req.params.token
  // const decodedToken = jwt.decode(token, "RANDOM-TOKEN");
  //for testing purpose : 
//   const decodedToken = {"id" : 100
// };
// const vendorId =   decodedToken.id
  const vendorId = req.params.resId
  

  Order.find({restID: vendorId}).then((docs) => {
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
  Order.findOne({_id: orderID}).then((result) => {
    const custID = result['userID'];


    
    if(status === "confirm" || status === "denied" || status === "completed"){
   
        Order.updateOne({
          "_id" : orderID
        },{
          $set:{
            status:status
          }
  
        }).then((result)=>{
          //send the status update to customer
          mySocket = cust_sockets[custID];
          if(mySocket){
            mySocket.emit("receive_status", {orderID : orderID, status : status});
          }
          else{
            throw "Socket does not exist";
          }
          
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

}).catch((error)=>{
    res.status(400).send(        
        {
            message: "Could not determine customer id corresponding to the orderID.",
            error: error
        }
    )
    }
    )
    
}



//place order endpoint
module.exports.placeOrder = async (req, res, next) => {
  try {

    const token = req.body.token

    //for testing purpose : 
    const decodedToken = {"id" : 101,
                          "userRole": "user"
                        };
    
                        // const decodedToken = jwt.decode(token, "RANDOM-TOKEN");
    const userID = decodedToken.id
    const userRole = decodedToken.userRole
    const items = req.body.items;
    const instructions = req.body.instructions;
    const payementMode = req.body.payementMode;
    const restID = req.body.restID;
    let order;

    if(userRole==="vendor"){
      return res.status(400).send({
        message: "Only customers can place orders!"
      })
    }
    const orderObj = {
      userID : userID,
      items: items,
      instruction: instructions,
      payementMode: payementMode,
      restID : restID,
      status : "pending"
    };
    order = await Order.create(orderObj);
    await order.save()
              .then((result)=>{
                //send the notification through sockets
                mySocket = rest_sockets[restID];
                if(mySocket){
                  mySocket.emit("receive_order", orderObj);
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



