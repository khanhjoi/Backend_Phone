import phoneDetail from '../models/Phone/phoneDetail.js';
import db from '../models/index.js';

const getAllDiscount = async (req, res) => {
  try {
    const phones = await db.phone.findAll({
    });

    let phoneWithDetail = []
    for(const phone of phones) {
      let phoneDetailFormat = {};
      const phoneDetail = await db.phoneDetail.findAll({
        where: {
          phoneId: phone.id
        },
        include: [
          {
            model: db.color,
          },
          {
            model: db.capacity
          }
        ],
        attributes: {
          exclude: ['colorId','capacityId', 'phoneId'] // Add any fields you want to exclude here
        }
      })
      phoneDetailFormat = {
        ...phone.toJSON(),
        phoneDetail
      }
      phoneWithDetail.push(phoneDetailFormat)
    }

    if(phoneWithDetail.length <= 0) {
      return res.status(200).json({message : "Có lỗi xảy ra rồi"});

    }

    return res.status(200).json(phoneWithDetail);
  } catch (error) {
    console.log(error)
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
    const { nameDiscount, dateBegin, dateEnd, percent, listPhonePromotion } = req.body;
    
    const dateB = new Date(dateBegin);
    const dateE = new Date(dateEnd);
    
    if(!(nameDiscount && dateBegin && dateE && percent && listPhonePromotion )) {
      return res.status(400).json({message : "Thiếu dữ liệu vui lòng nhập lại"})
    }
    
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

      if(listPhonePromotion.length <= 0) {
        return res.status(400).json({message : "Chưa có điện thoại để giảm giá"})
      }

      for (const phone of listPhonePromotion) {
          
        const phoneModel = await db.phone.findByPk(phone.code);
        
        if(!phoneModel){
          return res.status(400).json({message : "có lỗi xảy ra"})
        }

        phoneModel.discountId = discount.id;

        await phoneModel.save();
      }

    } else {
      // check phone exit in discount -> if yes
      return res.status(200).json({message : 'giảm giá đã tồn tại'})
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