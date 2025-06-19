const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const Product = require("../model/Product");

const jwt = require("jsonwebtoken");


const getAllProduct = async(req, res) => {
   const products = await Product.find();
   if (!products) return res.status(204).json({ message:"no product foud"})
   res.json(products);
};

const creatNewProduct = async (req, res) => {
  if (
    !req?.body?.category ||
    !req?.body?.description ||
    !req?.body?.rating ||
    !req?.body?.productname ||
    !req?.body?.price||!req?.body?.img
  ) {
    return res.status(400).json({ message: "all field must be filled." });
  } 
  const dateTime = `${format(new Date(), "yyyyMMdd HH:mm:ss")}`;
  const productSerial = uuid();

  //console.log(req.body.productname);

  const token = req.cookies || req.headers.authorization.split(" ")[1];
  const cookieData = req.cookies?.jwt ? JSON.parse(req.cookies.jwt) : {};
  const userRole = cookieData.roles || "";
  console.log("User Role:", userRole);

  //console.log(token);
  //const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  
  
  try{
    const result = await Product.create({
    "product_id": productSerial,
    "product_name": req.body.productname,
    "category": req.body.category,
    "product_img": req.body.img,
    "product_desc": req.body.description,
    "product_rating": req.body.rating,
    "employee_id": userRole,
    "product_price": req.body.price,
    
  });
  res.status(201).json(result);
  } catch (err){
    console.error(err)
    res.status(500).json({ message: "Server error, please try again." });
  }
  

  

}
const updateProduct = async (req, res) => {
  try {
    if (!req?.body?.id) {
      return res.status(400).json({ message: "ID parameter required" });
    }

    const product = await Product.findOne({ _id: req.body.id }).exec();
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product ${req.body.id} not found` });
    }

    if (req.body?.category) {
      product.category = req.body.category;
    }
    if (req.body?.img) {
      product.img = req.body.img;
    }
    if (req.body?.desc) {
      product.description = req.body.description;
    }
    if (req.body?.rating) {
      product.rating = req.body.rating;
    }

    const result = await product.save();
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getSpecificProduct = async (req, res) => {
  const searchTerm = req.query.query
  if(!searchTerm) {
    return res.status(400).json({ message:"search term is required"})
  }
  try {
    const query = { $or:[{ product_name :{$regex:searchTerm,$options:"i"}}]  };
    const result = await Product.find(query);
    res.json(result);
    console.log("sedig result");
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "Server error during search" });

    
  }
}
const deleteProduct =async (req, res) => {
  if (req?.body?.id) {
    return res.status(400).json({ message: "id parameter required" });
  }
  const product = await Product.findOne({_id: req.body.id}).exec();
  if (!product) {
    return res.status(400).json({ message: `Staff ${req.body.id} ot foud` });
  }

  const result = await product.deleteOne({_id: req.body.id})

  res.json(result);
};
const getProduct = async(req, res) => {
  if (req?.params?.id) {
    return res.status(400).json({ message: "id parameter required" });
  }
  const product = await Product.findOne({_id: req.params.id}).exec();
  ;
  if (!product) {
    return res
      .status(400)
      .json({ message: `product ${req.params.id} ot foud` });
  }
  console.log("hereeee");
  res.json(product);
};

module.exports = {
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  creatNewProduct,
  getSpecificProduct,
};
