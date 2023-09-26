import db from "../models/index.js";


const createOrder = async (req, res) => {
  try {
    const { providerName, providerLocation, purchaseName, totalPrice, phoneList } = req.body;

    const user = await db.user.findOne({ where : {email: req.user.email}});

    if(!user.role) {
      return res.status(403).json({ message: "Người dùng không thể thực hiện chức năng này"});
    }

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
      const { name, price, detail, mainImage, brandName, categoryName, capacities, colors, quantity } = phone;

      // Check if the brand already exists, or create a new one
      let brand = await db.brand.findOne({ where: { brand_name: brandName } });
      if (!brand) {
        brand = await db.brand.create({ brand_name: brandName });
      }

      // Check if the category already exists, or create a new one
      let category = await db.category.findOne({ where: { category_name: categoryName  } });
      if (!category) {
        category = await db.category.create({ category_name: categoryName});
      }
      // // Check if the phone already exists
      // let existingPhone = await db.phoneDetail.findOne({ 
      //   where: { 
      //     capacityId: capacityModel.id, 
      //     providerId: provider.id, 
      //     colorId: colorModel.id 
      //   } 
      // });
      
      // if (existingPhone) {
      //   // The phone already exists, so update the quantity
      //   existingPhone.quantity += quantity;
      //   await existingPhone.save();
      //   console.log("Added more quantity");
        
      //   await db.PurchaseDetail.create({
      //     purchaseId: purchaseOrder.id,
      //     phoneId: existingPhone.phoneId,
      //     quantity,
      //     price
      //   });
      //   continue;
      // }

      // Create the phone
      const phoneModel = await db.phone.create({
        name,
        price,
        detail,
        mainImage,
        brandId: brand.id,
        categoryId: category.id,
        price,
        quantity
      });

        // Create the associated capacities
      await db.capacity.bulkCreate(capacities.map(capacity => ({
        phoneId: phoneModel.id,
        nameCapacity: capacity.name,
        additionalPrice: capacity.additionalPrice
      })));

      // Create the associated colors
      await db.color.bulkCreate(colors.map(color => ({
        phoneId: phoneModel.id,
        nameColor: color.name,
        additionalPrice: color.additionalPrice
      })));

      // Create the PurchaseDetail
      const purchaseDetail = await db.PurchaseDetail.create({
        purchaseId: purchaseOrder.id,
        phoneId: phoneModel.id,
        quantity,
        price
      });

      phoneModel.purchaseDetailId = purchaseDetail.id;
      await phoneModel.save();
    }

    return res.status(200).json({ providerName, providerLocation, purchaseName, totalPrice, phoneList });
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default { createOrder };