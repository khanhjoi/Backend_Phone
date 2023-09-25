import db from "../models/index.js";


const createOrder = async (req, res) => {
  try {
    const { providerName, providerLocation, purchaseName, totalPrice, phoneList } = req.body;

    // Create the provider
    let provider = await db.provider.findOne({ where: { providerName: providerName } });
    if (!provider) {
      provider = await db.provider.create({
        providerName,
        providerLocation
      });
    }

    // Create the purchase order
    const purchaseOrder = await db.purchaseOrder.create({
      purchaseName,
      totalPrice,
      providerId: provider.id
    });

    // Loop through the phoneList array
    for (const phone of phoneList) {
      const { name, price, detail, mainImage, brandName, categoryName, capacity, color, quantity } = phone;

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

      // Check if the color already exists, or create a new one
      let colorModel = await db.color.findOne({ where: { nameColor: color } });
      if (!colorModel) {
        colorModel = await db.color.create({ nameColor: color });
      }

      // Check if the capacity already exists, or create a new one
      let capacityModel = await db.capacity.findOne({ where: { nameCapacity: capacity } });
      if (!capacityModel) {
        capacityModel = await db.capacity.create({ nameCapacity: capacity });
      }

      // Check if the phone already exists
      let existingPhone = await db.phoneDetail.findOne({ 
        where: { 
          capacityId: capacityModel.id, 
          providerId: provider.id, 
          colorId: colorModel.id 
        } 
      });
      
      if (existingPhone) {
        // The phone already exists, so update the quantity
        existingPhone.quantity += quantity;
        await existingPhone.save();
        console.log("Added more quantity");
        
        await db.PurchaseDetail.create({
          purchaseId: purchaseOrder.id,
          phoneId: existingPhone.phoneId,
          quantity,
          price
        });
        continue;
      }

      // Create the phone
      const phoneModel = await db.phone.create({
        name,
        price,
        detail,
        mainImage,
        brandId: brand.id,
        categoryId: category.id
      });

      // Create the phoneDetail
      const phoneDetail = await db.phoneDetail.create({
        phoneId: phoneModel.id,
        price,
        quantity,
        colorId: colorModel.id,
        capacityId: capacityModel.id,
        providerId: provider.id
      });


      // Create the PurchaseDetail
      const purchaseDetail = await db.PurchaseDetail.create({
        purchaseId: purchaseOrder.id,
        phoneId: phoneModel.id,
        quantity,
        price
      });
    }

    return res.status(200).json({ providerName, providerLocation, purchaseName, totalPrice, phoneList });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default { createOrder };