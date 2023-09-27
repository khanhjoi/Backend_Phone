import db from '../models/index.js';

export const newAddress = async (req, res) => {
  try {
    const { commune, wart, city, detail } = req.body;

    if(!(commune && wart && city))  {
      return res.status(400).json({message: "Phải điền đủ thông tin !!!"});
    }

    const user = await db.user.findOne({ where : {email: req.user.email}});

    if(!user) {
      return res.status(400).json({message: "Người dùng không tồn tại"});
    }

    const address = await db.address.create({
      commune,
      wart,
      city,
      detail,
      userId: user.userId,
    })

    const newUser = await db.user.findOne({
      where: { email: req.user.email },
      include: [{ model: db.address }],
    });

    console.log(newUser)

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const updateAddress = async (req, res) => {
  try {

    const { commune, wart, city, detail } = req.body;

    if(!(commune && wart && city))  {
      return res.status(400).json({message: "Phải điền đủ thông tin !!!"});
    }

    const user = await db.user.findOne({
      where: { email: req.user.email },
      include: [{ model: db.address }],
    });

    const addressUser = await db.address.findOne({
      where: {
        addressId: req.params.id,
        userId: user.userId,
      }
    })
    
    if(!addressUser)  {
      return res.status(400).json({message: "Có lỗi xảy ra"});
    }

    addressUser.commune = commune;
    addressUser.wart = wart;
    addressUser.city = city;
    addressUser.detail = detail || addressUser.detail;

    await addressUser.save();

    return res.status(200).json(addressUser);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export const removeAddress = async (req, res) => {
  try {
    const user = await db.user.findOne({
      where: { email: req.user.email },
      include: [{ model: db.address }],
    });

    const addressUser = await db.address.findOne({
      where: {
        addressId: req.params.id,
        userId: user.userId,
      }
    })

    await addressUser.destroy();

    return res.status(200).json({ message: "Xóa địa chỉ thành công!!!"});
    
  } catch (error) {
    return res.status(400).json(error);
  }
}