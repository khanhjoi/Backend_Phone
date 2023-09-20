import db from "../models/index.js";

const createPhone = async (req, res) => {
  try {
    const { name, price, detail, mainImage, brandName, categoryName, discountList } = req.body;

    console.log(name, price, detail, mainImage, brandName, categoryName, discountList)

    // Check if the brand already exists, or create a new one
    let brand = await db.brand.findOne({ where: { brand_name: brandName } });
    if (!brand) {
      brand = await db.brand.create({ brand_name: brandName });
    }

    // Check if the category already exists, or create a new one
    let category = await db.category.findOne({ where: { category_name: categoryName } });
    if (!category) {
      category = await db.category.create({ category_name: categoryName });
    }

    // Create a new phone object
    const phone = await db.phone.create({
      name,
      price,
      detail,
      mainImage,
      brandId: brand.id,
      categoryId: category.id
    });

    // Associate the discountList with the newly created phone
    if (discountList && discountList.length > 0) {
      await phone.setDiscounts(discountList);
    }

    res.status(201).json(phone);
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred");
  }
};

export default { createPhone };