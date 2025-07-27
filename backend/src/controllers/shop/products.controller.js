import { Product } from "../../models/product.model.js";

const getFilteredProduct = async (req, res) => {
  try {

    console.log(req.query);

    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      filters.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    console.log(filters);
    // { category: { '$in': [ 'kids' ] }, brand: { '$in': [ 'h&m' ] } }


    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.productPrice = 1;

        break;
      case "price-hightolow":
        sort.productPrice = -1;

        break;
      case "title-atoz":
        sort.productTitle = 1;

        break;

      case "title-ztoa":
        sort.productTitle = -1;

        break;

      default:
        sort.productPrice = 1;
        break;
    }

    const product = await Product.find(filters).sort(sort);


    if (!product) {
      return res.json({
        success: false,
        message: "product doesnot exist!"
      })
    }
    return res.json({
      success: true,
      data: product
    })
  } catch (error) {

    console.log(error);


    return res.json({
      success: false,
      message: error
    })
  }
}

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

export { getFilteredProduct,getProductDetails }