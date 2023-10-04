import Cart from "../models/User/Cart.js";
import db from "../models/index.js";

export const getCart = async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { email: req.user.email },
      include: [{ model: db.cart }],
    });

    const cartDetail = await db.cart.findByPk(user.cart.id,
      {include: [{ model: db.phone }]}
    )

    return res.status(200).json(cartDetail);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const addItemToCart = async (req, res) => {
  try { 

    const { phoneId, quantity, capacityId, colorId } = req.body

    const user = await db.user.findOne({
      where: {
        email: req.user.email
      }
    })

    let cart = await db.cart.findOne({
      where: {userId: user.userId}
    })

    if(!cart){
      cart = await db.cart.create({
        userId: user.userId,
        totalPrice: 0,
      })
    }
    
    // check cart exit or not
    let cartDetail = await db.cartDetail.findOne({
      where: {cartId: cart.id}
    })

    const customIdPhone =  phoneId.toString() + capacityId + colorId;
    console.log(typeof customIdPhone);
    // if(!cartDetail){
    //   // cart not exit -> create it 
    //   cartDetail = await db.cartDetail.create({
    //     phoneId: phoneId,
    //     cartId: cart.id,
    //     quantity: quantity,
    //     colorId,
    //     capacityId
    //   })
    //   //  Then calculate a total price
    //   const tolPrice = await calculateTotalPrice(cart.id);
    //   cart.totalPrice = tolPrice;
    //   await cart.save();

    //   return res.status(200).json({message : "Đã thêm sản phẩm thành công"});
    // } else {
    //   // cart exit -> check phone in cartDetail
    //   const phoneExit = await db.cartDetail.findOne({
    //     where : {
    //       phoneId: phoneId,
    //       capacityId: capacityId,
    //       colorId: colorId
    //     }
    //   })

    //   if(!phoneExit) {
    //     // if phone not exit in cart -> create 
    //     await db.cartDetail.create({
    //       phoneId: phoneId,
    //       cartId: cart.id,
    //       quantity: quantity,
    //       colorId,
    //       capacityId
    //     })

    //     //  Then calculate a total price
    //     const tolPrice = await calculateTotalPrice(cart.id);
    //     cart.totalPrice = tolPrice;
    //     await cart.save();
    //     return res.status(200).json({ message: "Sản phẩm mới đã được thêm vào giỏ hàng!!!"})
    //   } else {
    //     // if phone exit -> plus one to quantity
    //     phoneExit.quantity += quantity;
    //     await phoneExit.save();

    //     //  Then calculate a total price
    //     const tolPrice = await calculateTotalPrice(cart.id);
    //     cart.totalPrice = tolPrice;
    //     await cart.save();

    //     return res.status(200).json({ message: `Đã thêm cộng thêm ${quantity} sản phẩm vào giỏ hàng!!!`})
    //   }
    // } 
    return res.status(200).json(customIdPhone);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const updateItemToCart = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const removeItemToCart = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(400).json(error);
  }
}
// calculate price in cart

const calculateTotalPrice = async (cartId) => {
  try {
    console.log("ok")
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

    let totalPrice = 0;

    for (const phone of cart[0].phones) {
      const { price, cartDetail, discounts } = phone;
      let phoneTotalPrice = price * cartDetail.quantity;

      for(const discount of discounts) {
        const { percent } = discount;
        const discountAmount = phoneTotalPrice * (percent/100);
        phoneTotalPrice -= discountAmount;
      }

      totalPrice += phoneTotalPrice;
    }
    return Number(totalPrice.toFixed(4));
  } catch (error) {
    // Handle the error appropriately
    console.error(error);
    throw error;
  }
};