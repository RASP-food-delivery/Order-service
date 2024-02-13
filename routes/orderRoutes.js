const controller = require("../controllers/orderController")

const router = require("express").Router();

router.route("/getOrders/:resId")
.get(controller.getOrders)

router.route("/getCompletedOrders/:resId")
.get(controller.getCompletedOrders)

router.route("/orderhistory/:userId")
.get(controller.orderHistory)


router.post("/placeOrder", controller.placeOrder)
router.post("/statusUpdate", controller.statusUpdate)


// router.post("/fetchOrder", controller.getOrders)

module.exports = router; 