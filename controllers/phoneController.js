import db from "../models/index.js";
import { Op } from "sequelize";

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
  const { brand, category, priceLow, priceUp } = req.query;
  let phones = null;
  phones = await db.phone.findAll({
    where: {
      price: {
        [Op.gt]: Number(priceLow)|| 0,
        [Op.lt]: Number(priceUp) || Number.MAX_VALUE
      }
    },
    include: [
      {
        model: db.brand,
        where: brand ? { brand_name: brand } : {},
      },
      {
        model: db.category,
        where: category ? { category_name: category } : {},
      },
    ],
  });

  if (phones.length === 0) {
    return res.status(200).json({ message: "No Phone in store" });
  }

  return res.status(200).json(phones);
};

const getPhone = async (req, res) => {
  const id = req.params.id;
  const phoneDetail = await db.phone.findAll({
    where: {
      id: id
    },
    include: [
      {
        model: db.phoneDetail,
        include: [
          {
            model: db.color
          },
          {
            model: db.capacity
          }
        ]
      }
    ],
    attributes: {
      exclude: ['id', 'name', 'detail', 'mainImage', 'price', 'brandId', 'categoryId', 'discountId'] // Add any fields you want to exclude here
    }
  });

  const phone = await db.phone.findAll({
    where: {
      id: id
    },
    include: [
      {
        model: db.rate,
      }
    ]
  });
  if(phone === null) {
    return res.status(400).json({ message: "can't find phone"});
  }

  return res.status(200).json({phone, phoneDetail});
}

export default { createPhone, getAllPhone, getPhone};