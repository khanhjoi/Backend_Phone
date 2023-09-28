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
      where: { email: req.user.email },
      include: [{ model: db.cart }],
    });

    const phone = await db.phone.findByPk(phoneId);
     
    if(!(phone && user)) {
      return res.status(400).json({message: "Có lỗi xảy ra !!"});
    }

    let cart = await db.cart.findOne({
      where: {userId: user.userId}
    })

    if(!cart){
      cart = await db.cart.create({
        userId: user.userId,
        totalPrice: phone.price
      })
    }

    let cartDetail = await db.detailCart.findOne({
      where: {cartId: cart.id}
    })

    if(!cartDetail){
      cart = await db.detailCart.create({
        phoneId: phone.id,
        cartId: cart.id,
        quantity: quantity,
        colorId,
        capacityId
      })
    }


    return res.status(200).json({message : "Thêm sản phẩm thành công!!!"});
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