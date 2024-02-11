const controller = require("../controllers/orderController")

const router = require("express").Router();

router.route("/getOrders/:resId")

.get(controller.getOrders)


router.post("/placeOrder", controller.placeOrder)
router.post("/statusUpdate", controller.statusUpdate)


// router.post("/fetchOrder", controller.getOrders)

module.exports = router; 