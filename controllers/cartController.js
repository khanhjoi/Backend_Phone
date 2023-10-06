import Cart from "../models/User/Cart.js";
import db from "../models/index.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.data.userId; // Assuming you have the user ID from the request
    // Find the user with the specified ID and include the associated phones
    const cart = await db.cart.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: db.phone
          ,
          attributes: {
            exclude: ['brandId', 'categoryId', 'detail'] // Add any fields you want to exclude here
          }
        }
      ],
      attributes: {
        exclude: ['userId', 'phoneId'] // Add any fields you want to exclude here
      }
    });

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const addItemToCart = async (req, res) => {
  try { 
    const { phoneId, quantity, capacityId, colorId, colorName, capacityName } = req.body
    const userId = req.user.data.userId; // Assuming you have the user ID from the request
    // Find the user with the specified ID and include the associated phones
    const count = await db.cart.count({
      where: {
        userId: userId,
      },
    });

    
    if(count > 0) {
      const cart = await db.cart.findAll({
        where:{
          userId: userId
        }
      })
      
      let checkExit = false;

      for (let phone of cart) {
        if(phoneId === phone.phoneId && capacityId === phone.capacityId && colorId === phone.colorId && userId === phone.userId) {
          const cartUpdate = await db.cart.findOne({
            where:{
              phoneId: phone.phoneId,
              capacityId: phone.capacityId,
              colorId: phone.colorId
            }
          });
          cartUpdate.quantity += quantity;
          checkExit = true;
          await cartUpdate.save();
        }else {
          continue;
        }
      }

      if(!checkExit) {
        const cart = await db.cart.create({
          userId, 
          phoneId,
          capacityId,
          colorId,
          colorName,
          capacityName,
          quantity
        })
      }

      return res.status(200).json({message: "thêm sản phẩm thành công"});
    }else {
      // user init cart
  
      const phone = await db.phone.findByPk(phoneId)
      console.log("okoko")

      if(!phone) {
        return res.status(400).json({message : "có lỗi xảy ra"})
      }
      const cart = await db.cart.create({
        userId, 
        phoneId,
        capacityId,
        colorId,
        colorName,
        capacityName,
        quantity
      })
      return res.status(200).json({cart});
    }
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const updateItemToCart = async (req, res) => {
  try {
    const { phoneId, quantity, capacityId, colorId} = req.body
    
    if(!(phoneId && capacityId && colorId && quantity)) {
      return res.status(400).json({message : "Có lỗi xảy ra"});
    }

    const cart = await db.cart.findOne({
      where: {
        phoneId,
        capacityId,
        colorId
      }
    })

    if(!cart) {
      return res.status(400).json({message : "Có lỗi xảy ra"});
    }

    cart.quantity = quantity;
    await cart.save();
    
    return res.status(200).json(cart)
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const removeItemToCart = async (req, res) => {
  try {
    const { phoneId, capacityId, colorId} = req.body
    
    if(!(phoneId && capacityId && colorId)) {
      return res.status(400).json({message : "Có lỗi xảy ra"});
    }

    const cart = await db.cart.findOne({
      where: {
        phoneId,
        capacityId,
        colorId
      }
    })

    if(!cart) {
      return res.status(400).json({message : "Có lỗi xảy ra"});
    }

    await cart.destroy();

    return res.status(200).json({message : "Xóa sản phẩm thành công"})
  } catch (error) {
    console.log(error)
  }
}

// calculate price in cart
const calculateTotalPrice = async (cartId) => {
  try {
    const cart = await db.cart.findAll({
      include: [
        {
          model: db.phone,
          through: {
            where: { cartId: cartId },
            attributes: ['capacityId', 'colorId', 'quantity']
          },
          include: [
            {
              model: db.discount
            }
          ]
        }
      ]
    });

    console.log(cart)
  
    let totalPrice = 0;

    // for (const phone of cart[0].phones) {
    //   const { price, cartDetail, discounts } = phone;
    //   let phoneTotalPrice = price * cartDetail.quantity;

    //   for(const discount of discounts) {
    //     const { percent } = discount;
    //     const discountAmount = phoneTotalPrice * (percent/100);
    //     phoneTotalPrice -= discountAmount;
    //   }

    //   totalPrice += phoneTotalPrice;
    // }
    // return Number(totalPrice.toFixed(4));
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    throw error;
  }
};