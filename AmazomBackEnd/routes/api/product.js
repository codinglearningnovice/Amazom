const express = require("express");
const path = require("path");
router = express.Router();
const productController = require("../../controller/productController");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");
const roles_list = require("../../config/roles_list");
//const router = require("../root");

router
  

  .get("/",productController.getAllProduct)
  .get("/:id",productController.getProduct);

router  .use(verifyJWT);


router
  
  .post("/",verifyRoles(roles_list.employee), productController.creatNewProduct)
  .put("/",verifyRoles(roles_list.employee), productController.updateProduct)
  .delete("/",verifyRoles(roles_list.employee), productController.deleteProduct);


module.exports = router;
