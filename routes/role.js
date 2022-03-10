const router = require("express").Router();
const roleController = require("../requests/role");


router.post("/create", roleController.add);

module.exports = router;