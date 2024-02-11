
// var amqp = require('amqplib/callback_api');

const notifHandler = (orderID, restID) =>{
    
    console("bleh")
    
    // amqp.connect('amqp://localhost', function(error0, connection) {
    //     if (error0) {
    //         throw error0;
    //     }
    //     connection.createChannel(function(error1, channel) {
    //         if (error1) {
    //             throw error1;
    //         }
    //         var exchange = 'direct_orders';
    //         var msg = {
    //             orderID : orderID,
    //             update : "Placed"
    //         };
    //         var restaurant = restID;

    //         channel.assertExchange(exchange, 'direct', {
    //             durable: false // the msg will persist in the queue
    //         });

    //         channel.publish(exchange, restaurant, Buffer.from(JSON.stringify(msg)));
    //         console.log(" Notification sent to %s: '%s'", restaurant, JSON.stringify(msg));
    //     });

    //     setTimeout(function() {
    //         connection.close();
    //         process.exit(0);
    //     }, 500);
    // });

};
const notifStub = (orderID, restID) =>{
    console.log("(Stub) Notification sent to restaurant", restID, " that order ID: ", orderID , " has been placed.")
};



module.exports = { notifHandler , notifStub}