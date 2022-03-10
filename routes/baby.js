const router = require("express").Router();
const { jwtAuthMiddleware } = require("../helpers/jwtAuth");
const babyController = require("../requests/baby");

router.post("/create", [jwtAuthMiddleware], babyController.add);
router.get("/", [jwtAuthMiddleware], babyController.getBabyList);
router.put("/:id", [jwtAuthMiddleware], babyController.update);
// login through baby box LCD TFT
router.post("/login", babyController.loginBabyBox);

module.exports = router;
