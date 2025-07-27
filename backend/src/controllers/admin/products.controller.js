import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { Product } from "../../models/product.model.js";

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");

    const url = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await uploadOnCloudinary(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error,
    });
  }
};

//add product
const addProduct = async (req, res) => {

  try {
    const {
      image,
      productTitle,
      productDescription,
      category,
      brand,
      productPrice,
      productSalePrice,
      totalStock,
      // averageReview,
    } = req.body;

    console.log(image,
      productTitle,
      productDescription,
      category,
      brand,
      productPrice,
      productSalePrice,
      totalStock,);

    if (
      [
        image,
        productTitle,
        productDescription,
        category,
        brand,
        productPrice,
        totalStock,
      ].some((filed) => filed?.trim() === "")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required!" });
    }

    const newProduct = await Product.create({
      image,
      productTitle,
      productDescription,
      category,
      brand,
      productPrice,
      productSalePrice,
      totalStock,
      // averageReview,
    });

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//fetch all product
const fetchAllProduct = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});

    return res.status(201).json({ success: true, data: listOfProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {

    const {id} = req.params;

    const {
      image,
      productTitle,
      productDescription,
      category,
      brand,
      productPrice,
      productSalePrice,
      totalStock,
      // averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if(!findProduct) {
      return res
        .status(400)
        .json({
          success : false,
          message : "Product not Exist"
        })
    }

    findProduct.productTitle = productTitle || findProduct.productTitle;
    findProduct.productDescription = productDescription || findProduct.productDescription;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.productPrice = productPrice === "" ? 0 : productPrice || findProduct.productPrice;
    findProduct.productSalePrice =
    productSalePrice === "" ? 0 : productSalePrice || findProduct.productSalePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    // findProduct.averageReview = averageReview || findProduct.averageReview;

    // Save the updated product
    await findProduct.save();

    return res.status(201).json({ success: true, data: findProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured",
    });
  }
};

//delete a product
const deleteProduct = async (req,res) => {
try {
    const {id} = req.params;
  
    const findProduct = await Product.findByIdAndDelete(id);
  
    return res
      .status(200)
      .json({
        success : true,
        data : {}
      })
} catch (error) {
  console.log(error);
  return res
    .status(500)
    .json({
      success : false,
      message : "Error Occured"
    })
  
}
}


export { handleImageUpload, addProduct,fetchAllProduct,editProduct,deleteProduct };
