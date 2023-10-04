import db from "../models/index.js";


const createOrder = async (req, res) => {
  try {
    const { providerName, providerLocation, purchaseName, totalPrice, phone, mainImage } = req.body;

    const user = await db.user.findOne({ where : {email: req.user.email}});
    
    if(!user) {
      return res.status(403).json({ message: "Người dùng không tồn tại"});
    }

    if(!user.role) {
      return res.status(403).json({ message: "Người dùng không thể thực hiện chức năng này"});
    }

    // Create the purchase order
    const purchaseOrder = await db.purchaseOrder.create({
      purchaseName,
      providerLocation,
      providerName,
      totalPrice: 0,
    });

    // Loop through the phoneList array

    const phoneExit = await db.phone.findOne({
      where: {name: phone.name}
    })

    if(!phoneExit){

      let brand = await db.brand.findOne({ where: { brand_name: phone.brandName } });
      if (!brand) {
        brand = await db.brand.create({ brand_name: phone.brandName });
      }

      // Check if the category already exists, or create a new one
      let category = await db.category.findOne({ where: { category_name: phone.categoryName } });
      if (!category) {
        category = await db.category.create({ category_name: phone.categoryName });
      }

      const phoneCreate = await db.phone.create({
        name: phone.name,
        detail: phone.detail,
        price: phone.price,
        mainImage: phone.mainImage,
        brandId: brand.id,
        categoryId: category.id
      });
 
      // create color and capacity to create detailPhone
      for (const opt of phone.option) {
        const colorPhone = await db.color.create({
          nameColor: opt.color.color,
          additionalPrice: opt.color.additionalPrice,
        })

        const capacityPhone = await db.capacity.create({
          nameCapacity: opt.capacity.capacity,
          additionalPrice: opt.capacity.additionalPrice,
        })

        const phoneDetail = await db.phoneDetail.create({
          phoneId: phoneCreate.id,
          colorId: colorPhone.id,
          capacityId: capacityPhone.id,
          quantity: opt.quantity
        })

        // create Purchase detail
        const PurchaseDetail = await db.PurchaseDetail.create({
          phoneId: phoneCreate.id,
          purchaseOrderId: purchaseOrder.id,
          colorId: colorPhone.id,
          capacityId: capacityPhone.id,
          price: phoneCreate.price,
          quantity: opt.quantity
        })
      }
      return res.status(200).json({message: "nhập hàng thành công"});
    }else {
      // if phone exited
      const phoneDetail = await db.phoneDetail.findAll({
        where: {
          phoneId: phoneExit.id
        },
        include: [
          {
            model: db.color,
          },
          {
            model: db.capacity,
          }
        ]
      });

      for (let phoneM of phoneDetail) {
        for (let opt of phone.option) {
          if(phoneM.color.nameColor === opt.color.color && phoneM.capacity.nameCapacity === opt.capacity.capacity) {
            phoneM.quantity += opt.quantity;
            await phoneM.save();
            const PurchaseDetail = await db.PurchaseDetail.create({
              phoneId: phoneExit.id,
              purchaseOrderId: purchaseOrder.id,
              colorId: phoneM.color.id,
              capacityId: phoneM.capacity.id,
              price: phone.price,
              quantity: opt.quantity
            })
          }
        }
      }
      return res.status(200).json(phoneDetail);
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default { createOrder };