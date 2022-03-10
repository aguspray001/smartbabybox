const router = require("express").Router();
const { jwtAuthMiddleware } = require("../helpers/jwtAuth");
const measurementController = require("../requests/measurement");

router.post("/create", measurementController.add);
router.get("/", [jwtAuthMiddleware], measurementController.paging);
// set params, because there is no baby_id in res.user (auth token) 
router.get("/:babyId", [jwtAuthMiddleware], measurementController.getById);
router.get("/download/:babyId", measurementController.downloadExcel);
module.exports = router;
