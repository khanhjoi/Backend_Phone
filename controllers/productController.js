import db from "../models/index.js";

const createPhone = async (req, res) => {
  try {
    const { name, price, detail, mainImage, brandName, categoryName, capacity, color, quantity} = req.body;
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

    // Check if the capacity already exists, or create a new one
    let colorModel = await db.color.findOne({ where: { nameColor: color } });
    if (!colorModel) {
      colorModel = await db.color.create({ nameColor: color });
    }

    // Check if the capacity already exists, or create a new one
    let capacityModel = await db.capacity.findOne({ where: { nameCapacity: capacity } });
    if (!capacityModel) {
      capacityModel = await db.capacity.create({ nameCapacity: capacity });
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


    const phoneDetail = await db.phoneDetail.create({
      phoneId: phone.id,
      price,
      quantity,
      colorId: colorModel.id,
      capacityId: capacityModel.id
    })

    res.status(201).json({
      phone,
      phoneDetail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred");
  }
};

const getAllPhone = async (req, res) => {
  const phones = await db.phone.findAll({
    include: [
      { model: db.capacity },
      { model: db.color }
    ]
  });

  if(phones === null) {
    return res.status(504).json({ message: "No Phone in store"});
  }

  return res.status(200).json(phones);

};

const getPhone = async (req, res) => {
  const id = req.params.id;
  const phone = await db.phone.findByPk(id);
  if(phone === null) {
    return res.status(400).json({ message: "can't find phone"});
  }

  return res.status(200).json(phone);
}

export default { createPhone, getAllPhone, getPhone};