import db from "../models/index.js";


const createOrder = async (req, res) => {
  try {
    const { providerName, providerLocation, purchaseName, totalPrice, phone, mainImage } = req.body.provider;
    const detail  = req.body.detail;
    const user = await db.user.findOne({ where : {email: req.user.data.email}});
    if(!user) {
      return res.status(403).json({ message: "Người dùng không tồn tại"});
    }

    if(!user.role) {
      return res.status(403).json({ message: "Người dùng không thể thực hiện chức năng này"});
    }

    if(!(providerName && providerLocation && purchaseName && totalPrice && phone)) {
      return res.status(403).json({ message: "bạn nhập thiếu dữ liệu"});
    }

    // Create the purchase order
    const purchaseOrder = await db.purchaseOrder.create({
      purchaseName,
      providerLocation,
      providerName,
      totalPrice: totalPrice,
    });
    // Loop through the phoneList array
    console.log(phone)
    const phoneExit = await db.phone.findOne({
      where: {name: phone.name}
    })

    if(!phoneExit){
      console.log('check')

      let brand = await db.brand.findOne({ where: { brand_name: phone.brandName } });
      if (!brand && phone.brandName !== '') {
        brand = await db.brand.create({ brand_name: phone.brandName });
      }

      // Check if the category already exists, or create a new one
      let category = await db.category.findOne({ where: { category_name: phone.categoryName } });
      if (!category && phone.categoryName !== '') {
        category = await db.category.create({ category_name: phone.categoryName });
      }
      
      const phoneCreate = await db.phone.create({
        name: phone.name,
        detail: detail,
        price: phone.price,
        mainImage: phone.mainImage,
        brandId: brand.id,
        categoryId: category.id
      });

      
      // create color and capacity to create detailPhone
      for (const opt of phone.option) {
        console.log(opt)
        console.log('ok')
        const colorPhone = await db.color.create({
          nameColor: opt.color,
          additionalPrice: opt.additionalPrice,
        })

        const capacityPhone = await db.capacity.create({
          nameCapacity: opt.capacity,
          additionalPrice: opt.additionalPrice,
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
      return res.status(200).json({message: "nhập hàng thành công"});
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

export default { createOrder };