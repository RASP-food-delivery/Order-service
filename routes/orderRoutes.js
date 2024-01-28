const { placeOrder }  = require("../controllers/orderController")

const router = require("express").Router();

router.post("/placeOrder", placeOrder)

module.exports = router; 