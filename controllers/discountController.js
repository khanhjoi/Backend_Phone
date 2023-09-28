import db from '../models/index.js';

const getAllDiscount = async (req, res) => {
  try {
    const discounts = await db.discount.findAll({
      include: [
        { model: db.phone },
      ]
    })

    if(discounts.length === 0) {
      return res.status(400).json({ message: "Chưa có giảm giá !!"});
    }

    return res.status(200).json(discounts);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const getPhoneDiscount = async (req, res) => {
  try {
    const phoneDiscount = await db.phone.findByPk(req.params.idPhone,{
      include: [
        { model: db.discount },
      ]
    })

    if(!phoneDiscount) {
      return res.status(403).json({message: "Điện thoại chưa có giảm giá !!"});
    }

    return res.status(200).json(phoneDiscount);
  } catch (error) {
    return res.status(400).json(error);
  }
}

const addDiscount = async (req, res) => {
  try {
    const { nameDiscount, dateBegin, dateEnd, percent, listPhone } = req.body;
    
    const dateB = new Date(dateBegin);
    const dateE = new Date(dateEnd);
    
    let discount = await db.discount.findOne({
      where: { 
        nameDiscount: nameDiscount,
        dateBegin: dateB,
        dateEnd: dateE
      }
    });  

    if(!discount) {
      // check phone exit in discount -> if not
      discount = await db.discount.create({
        nameDiscount,
        dateBegin: dateB,
        dateEnd: dateE,
        percent,
      });

      const discountDetails = listPhone.map(phone => ({
        discountId: discount.id,
        phoneId: phone.phoneId
      }));

      await db.discountDetail.bulkCreate(discountDetails);

    } else {
      // check phone exit in discount -> if yes
      for (const phone of listPhone) {
        const existingDiscountDetail = await db.discountDetail.findOne({
          where: {
            discountId: discount.id,
            phoneId: phone.phoneId
          }
        });

        if (existingDiscountDetail) {
          continue;
        } else {
          await db.discountDetail.create({
            discountId: discount.id,
            phoneId: phone.phoneId,
          })
        } 
      }
    }

    return res.status(200).json({message: "Thêm giảm giá thành công !!!"});
  } catch (error) {
    return res.status(400).json(error);
  }
}

const updateDiscount = async (req, res) => {
  try {
    const discount = await db.discount.findByPk(req.params.id);
    const {nameDiscount, dateBegin, dateEnd, percent} = req.body;
    
    if(!discount) {
      return res.status(400).json({ message: "giảm giá không tồn tại!!!"});
    }

    if(!(nameDiscount && dateBegin && dateEnd && percent)) {
      return res.status(400).json({ message: "Nhập thiếu dữ liệu"});
    }

    discount.nameDiscount = nameDiscount;
    discount.dateBegin = dateBegin;
    discount.dateEnd = dateEnd;
    discount.percent = percent;
    
    await discount.save();

    return res.status(200).json({message: "cập nhật thành công !!"});

  } catch (error) {
    return res.status(400).json(error);
  }
}

const deleteDiscount = async (req, res) => {
  try {
    const discount = await db.discount.findByPk(req.params.id);

    if(!discount) {
      return res.status(400).json({ message: "giảm giá không tồn tại !! "})
    }

    await discount.destroy();

    return res.status(200).json({ message: "xóa giảm giá !!"})  
  } catch (error) {
    return res.status(400).json(error);
  }
}

export default {getPhoneDiscount, addDiscount, updateDiscount, deleteDiscount, getAllDiscount};