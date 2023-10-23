import db from "../models/index.js";
export const getAllBanner = async (req, res) => {
  try {  
    // check role user
    const banners = await db.PhoneBanner.findAll({
      include: [
        {
          model: db.phone,
          include: [
            {
              model: db.rate
            }
          ]
        }
      ]
    })

    return res.status(200).json(banners)
  } catch (error) {
    console.log(error)
  }
}
export const addPhonesToBanner = async (req, res) => {
  try {
    const { bannerId,  phoneId } = req.body;
    // check role user
    const user = await db.user.findByPk(req.user.data.userId);
    if(!user.role) {
      return res.status(200).json({message: "Người dùng không thể thực hiện chức năng này!"})
    }

    const phone = await db.phone.findByPk(phoneId)
    
    if(!phone) {
      return res.status(200).json({message: "Có lỗi xảy ra !"})
    }

    if(phone.phoneBannerId) {
      return res.status(200).json({message: "Sản phẩm đã có ở khung khác vui lòng xóa và thêm lại!"})
    }

    phone.phoneBannerId = bannerId;

    await phone.save()

    return res.status(200).json({message: "Thêm điện thoại vào khung thành công"})
  } catch (error) {
    console.log(error)
  }
}
export const removePhonesToBanner = async (req, res) => {
  try {
    const { phoneId } = req.body;
    // check role user
    const user = await db.user.findByPk(req.user.data.userId);
    if(!user.role) {
      return res.status(200).json({message: "Người dùng không thể thực hiện chức năng này!"})
    }

    const phone = await db.phone.findByPk(phoneId)
    
    if(!phone) {
      return res.status(200).json({message: "Có lỗi xảy ra !"})
    }

    phone.phoneBannerId = null;

    await phone.save()

    return res.status(200).json({message: "xóa điện thoại khỏi khung thành công"})
  } catch (error) {
    console.log(error)
  }
}
export const handleBanner = async (req, res) => {
  try {
    const {Banners} = req.body;

    const user = await db.user.findByPk(req.user.data.userId);
    if(!user.role) {
      return res.status(400).json({message: "Người dùng không thể thực hiện chức năng này!"})
    }

    if(Banners.length <= 0 ) {
      return res.status(400).json({message: "Có lỗi xảy ra!"})
    }
    // return res.status(400).json(Banners)
    // loop banner to find phone
    for(let banner of Banners) {
      if(banner.listPhone) {
        for(let phone of banner.listPhone) {
          // find multi phone in banner
  
          let phoneDB = await db.phone.findByPk(phone.code);
          // check phone exit
          
          if(!phoneDB) {
            return res.status(400).json({message: "Có lỗi xảy ra!"})
          }
          // update properties of phone
          phoneDB.phoneBannerId = banner.id;
          await phoneDB.save();
        }
      }
    }

    return res.status(200).json({message: "Thêm khung sản phẩm thành công"})
  } catch (error) {
    console.log(error)
  }
}
export const getPhonesBanner = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.user.data.userId);
    
    if(!user.role) {
      return res.status(200).json({message: "Người dùng không thể thực hiện chức năng này!"})
    }
 
    const phones = await db.phone.findAll({
    
    })

    return res.status(200).json(phones)
  } catch (error) {
    console.log(error)
  }
}
export const getPhoneInfoBanner = async (req, res) => {
  try {

    const id = req.params.id

    const user = await db.user.findByPk(req.user.data.userId);
    if(!user.role) {
      return res.status(200).json({message: "Người dùng không thể thực hiện chức năng này!"})
    }
 
    const phones = await db.phone.findByPk(id, {
      include: [
        {
          model: db.discount
        }
      ]
    });

    return res.status(200).json(phones)
  } catch (error) {
    console.log(error)
  }
}