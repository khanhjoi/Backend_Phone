import db from "../models/index.js";

export const getOrderUser = async (req, res) => {
  try {
    const id = req.params.id
    const order = await db.order.findOne({
      where: {
        id : id
      }
    })

    if(!order) {
      return res.status(400).json({message: "Có lỗi xảy ra!"})
    }

    return res.status(200).json(order)
  } catch (error) {
    console.log(error);
  }
}

export const getAllOrderUser = async (req, res) => {
  try {
    const orders = await db.order.findAll({
      where: {
        userId: req.user.data.userId
      }
    })

    if(orders.length <= 0) {
      return res.status(400).json({message: "Chưa có đơn hàng nào!"})
    }

    return res.status(200).json(orders)
  } catch (error) {
    console.log(error);
  }
}

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.data.userId;
    const { paymentId, totalPrice, address} =  req.body;
    const cart = await db.cart.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: db.phone,
          attributes: {
            exclude: ['brandId', 'categoryId', 'detail', 'phoneBannerId'] // Add any fields you want to exclude here
          },
          include: [
            {
              model: db.discount
            }
          ]
        }
      ],
      attributes: {
        exclude: ['userId', 'phoneId'] // Add any fields you want to exclude here
      }
    });

    if(cart.length <= 0) {
      return  res.status(200).json({message:  "Thêm sản phầm vào giỏ hàng để tạo đơn hàng!"})
    }
    if(!address) {
      return  res.status(200).json({message:  "phải có địa chỉ giao hàng"})
    }
    
    if(!(paymentId &&  totalPrice)) {
      return res.status(400).json({message: "có lỗi xảy ra"});
    }

    const order = await db.order.create({
      userId: userId,
      paymentId: paymentId,
      stateId: 1,
      address: address,
      totalPrice: totalPrice
    })

    for(const phone of  cart) {
      const phoneDetail= await db.phoneDetail.findOne({
        where:{
          phoneId:  phone.phone.id,
          colorId:  phone.colorId,
          capacityId: phone.capacityId,
        }
      })

      if(phoneDetail) {
        // if quantity phone >= 0 -> create order
        if(phoneDetail.quantity >= 0)   {     
          // createOrder detail
          const orderDetail =  await db.orderDetail.create({
            orderId: order.id,
            phoneId:  phone.phone.id,
            colorId:  phone.colorId,
            capacityId: phone.capacityId,
            colorName: phone.colorName,
            capacityName: phone.capacityName,
            quantity: phone.quantity
          })
          phoneDetail.quantity = phoneDetail.quantity - phone.quantity;

          // find phone in cart and delete it
          const phoneInCart = await db.cart.findOne({
            where:{
              phoneId:  phone.phone.id,
              colorId:  phone.colorId,
              capacityId: phone.capacityId,
            }
          })

          await phoneInCart.destroy();
          await phoneDetail.save();
        }else {
          await phoneDetail.destroy();
          await order.destroy();
          return  res.status(403).json({message: `điện thoại ${phone.phone.name} đã hết hàng!`});
        }
      }else {
        return  res.status(403).json({message: `điện thoại ${phone.phone.name} đã hết hàng!`});
      }
    }

    return res.status(200).json({message: "Đặt hàng thành công"})
  } catch (error) {
    console.log(error);
  }
}

export const getAllOrderAdmin = async (req, res) => {
  try {
    const userId = req.user.data.userId;
    const user = await db.user.findByPk(userId);

    if(!user.role) {
      return res.status(400).json({message : `Người dùng ${user.firstName} ${user.lastName} không thể thực hiện chức năng này!!`})
    }

    const Orders = await db.order.findAll({
      include: [
        {
          model: db.state
        },
        {
          model: db.payment
        }
      ]
    });

    return res.status(200).json(Orders);
  } catch (error) {
    console.log(error);
  }
}

export const handleOrderAdmin = async (req, res) => {
  try {
    const userId = req.user.data.userId;
    const user = await db.user.findByPk(userId);
    const {orderId, stateId} = req.body;
    if(!user.role) {
      return res.status(400).json({message : `Người dùng ${user.firstName} ${user.lastName} không thể thực hiện chức năng này!!`})
    }

    const order = await db.order.findByPk(orderId)

    if(!order) {
      return res.status(400).json({message : "có lỗi xảy ra!!"})
    }

    order.stateId = stateId;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
}

export const handleOrderUser= async (req, res) => {
  try {
    const userId = req.user.data.userId;
    const {orderId} = req.body;
    
    const order = await db.order.findByPk(orderId)

    if(!order) {
      return res.status(400).json({message : "có lỗi xảy ra!!"})
    }

    if(order.stateId < 2) {
      return res.status(400).json({message : "Đơn hàng chưa được giao bạn không thể xác nhận được"})
    }
    
    order.stateId = 3;
    await order.save();

    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
  }
}

export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.data.userId;
    const orderId = req.params.id;

    const order = await db.order.findByPk(orderId);

    if(order.userId === userId) {
      await order.destroy();
    }

    return res.status(200).json(order)
  } catch (error) {
    console.log(error);
  }
}

