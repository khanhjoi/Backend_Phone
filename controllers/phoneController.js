import db from "../models/index.js";
import { Op } from "sequelize";

const createPhone = async (req, res) => {
  try {
    const { name, price, detail, mainImage, brandName, categoryName, capacity, color, quantity} = req.body;
    // Check if the brand already exists, or create a new one
    let brand = await db.brand.findOne({ where: { brand_name: brandName } });
    if (!brand) {
      brand = await db.brand.create({ brand_name: brandName });
    }

    // Check if the category already exists, or create a new one
    let category = await db.category.findOne({ where: { category_name: categoryName } });
    if (!category) {
      category = await db.category.create({ category_name: categoryName });
    }

    // Check if the capacity already exists, or create a new one
    let colorModel = await db.color.findOne({ where: { nameColor: color } });
    if (!colorModel) {
      colorModel = await db.color.create({ nameColor: color });
    }

    // Check if the capacity already exists, or create a new one
    let capacityModel = await db.capacity.findOne({ where: { nameCapacity: capacity } });
    if (!capacityModel) {
      capacityModel = await db.capacity.create({ nameCapacity: capacity });
    }

    // Create a new phone object
    const phone = await db.phone.create({
      name,
      price,
      detail,
      mainImage,
      brandId: brand.id,
      categoryId: category.id
    });


    const phoneDetail = await db.phoneDetail.create({
      phoneId: phone.id,
      price,
      quantity,
      colorId: colorModel.id,
      capacityId: capacityModel.id
    })

    res.status(201).json({
      phone,
      phoneDetail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred");
  }
};

const getAllPhone = async (req, res) => {
  const { brand, category, priceLow, priceUp, priceMin, priceMax, search} = req.query;
  let phones = null;
  // if search exit
  if(search) {
    if(priceMin) {
      phones = await db.phone.findAll({
        where: {
          price: {
            [Op.lt]: Number(priceMin) || 3000000,
          },
          name: {
            [Op.like]: `%${search}%`
          }
        },
        include: [
          {
            model: db.brand,
            where: brand ? { brand_name: brand } : {},
          },
          {
            model: db.category,
            where: category ? { category_name: category } : {},
          },
          {
            model : db.rate
          }
        ],
      });
    
    } else if(priceLow && priceUp)  {
      phones = await db.phone.findAll({
        where: {
          price: {
            [Op.gt]: Number(priceLow) || 0,
            [Op.lt]: Number(priceUp) || Number.MAX_VALUE,
          },
          name: {
            [Op.like]: `%${search}%`
          }
        },
        include: [
          {
            model: db.brand,
            where: brand ? { brand_name: brand } : {},
          },
          {
            model: db.category,
            where: category ? { category_name: category } : {},
          },
          {
            model : db.rate
          }
        ],
      });
    } else if(priceMax) {
      phones = await db.phone.findAll({
        where: {
          price: {
            [Op.gt]: Number(priceMax) || 7000000,
          },
          name: {
            [Op.like]: `%${search}%`
          }
        },
        include: [
          {
            model: db.brand,
            where: brand ? { brand_name: brand } : {},
          },
          {
            model: db.category,
            where: category ? { category_name: category } : {},
          },
          {
            model : db.rate
          }
        ],
      });
    } else {
      phones = await db.phone.findAll({
        where: {
          name: { [Op.like]: `%${search}%`}
        },
        include: [
          {
            model: db.brand,
            where: brand ? { brand_name: brand } : {},
          },
          {
            model: db.category,
            where: category ? { category_name: category } : {},
          },
          {
            model : db.rate
          }
        ],
      });
    }
  } else {
    if(priceMin) {
      phones = await db.phone.findAll({
        where: {
          price: {
            [Op.lt]: 3000000,
          }
        },
        include: [
          {
            model: db.brand,
            where: brand ? { brand_name: brand } : {},
          },
          {
            model: db.category,
            where: category ? { category_name: category } : {},
          },
          {
            model : db.rate
          }
        ],
      });
    
      } else if(priceLow && priceUp)  {
        phones = await db.phone.findAll({
          where: {
            price: {
              [Op.gt]: Number(priceLow) || 0,
              [Op.lt]: Number(priceUp) || Number.MAX_VALUE,
            }
          },
          include: [
            {
              model: db.brand,
              where: brand ? { brand_name: brand } : {},
            },
            {
              model: db.category,
              where: category ? { category_name: category } : {},
            },
            {
              model : db.rate
            }
          ],
        });
      } else if(priceMax) {
        phones = await db.phone.findAll({
          where: {
            price: {
              [Op.gt]: Number(priceMax) || 7000000,
            }
          },
          include: [
            {
              model: db.brand,
              where: brand ? { brand_name: brand } : {},
            },
            {
              model: db.category,
              where: category ? { category_name: category } : {},
            },
            {
              model : db.rate
            }
          ],
        });
      } else {
        phones = await db.phone.findAll({
          include: [
            {
              model: db.brand,
              where: brand ? { brand_name: brand } : {},
            },
            {
              model: db.category,
              where: category ? { category_name: category } : {},
            },
            {
              model : db.rate
            }
          ],
        });
    }
  }
  
  if (phones.length === 0) {
    return res.status(200).json({ message: "No Phone in store" });
  }


  return res.status(200).json(phones);
};

const getPhone = async (req, res) => {
  try {
    const id = req.params.id;
    const phoneDetail = await db.phone.findAll({
      where: {
        id: id
      },
      include: [
        {
          model: db.phoneDetail,
          include: [
            {
              model: db.color
            },
            {
              model: db.capacity
            }
          ],attributes: {
            exclude: ['phoneBannerId','colorId', 'phoneId', 'capacityId'] // Add any fields you want to exclude here
          }
        }
      ],
      attributes: {
        exclude: ['id','phoneBannerId', 'name', 'detail', 'mainImage', 'price', 'brandId', 'categoryId', 'discountId'] // Add any fields you want to exclude here
      }
    });

    const phone = await db.phone.findAll({
      where: {
        id: id
      },
      include: [
        {
          model: db.rate,
          include: [
            {
              model: db.user,
              attributes: {
                exclude: ['email','phone', 'password', 'role', 'gender', 'token', 'createdAt','updatedAt'] // Add any fields you want to exclude here
              }
            }
          ],
          attributes: {
            exclude: ['updatedAt','userId', 'capacityId'] // Add any fields you want to exclude here
          }
        }
      ]
    });
    if(phone === null) {
      return res.status(400).json({ message: "can't find phone"});
    }

    return res.status(200).json({phone, option:phoneDetail});
  } catch (error) {
    console.log(error)
  }
}

const getAllPhoneAdmin = async (req, res) => {
  try {
    const phoneAlarm = req.query.phoneAlarm;

    if(phoneAlarm !== "true") {
      // get All phone 
      const phones = await db.phone.findAndCountAll({
        include: [
          {
            model: db.discount,
          }
        ],
        attributes: {
          exclude: ['phoneBannerId','categoryId ', 'discountId', 'brandId'] // Add any fields you want to exclude here
        }
      });
  
  
      if(phones === null) {
        return res.status(400).json({ message: "Không thể tìm điện thoại"});
      }
      let phoneNumber = phones.count;
      let phoneWithOption = [];
      
      for(const phone of phones.rows) {
        let formatOption = {}
        const option = await db.phoneDetail.findAll({
          where: {
            phoneId: phone.id
          },
          include:[
            {
              model: db.color,
            }, {
              model: db.capacity
            }
          ],
          attributes: {
            exclude: ['colorId', 'capacityId'] // Add any fields you want to exclude here
          }, 
        })
        
        formatOption = {... 
          phone.toJSON(),
          option
        }
        phoneWithOption.push(formatOption)
      }
      return res.status(200).json({ phoneNumber, phoneWithOption});
    }else {
      // if check phone less than 5
      const phones = await db.phone.findAndCountAll({
        include:[
          {
            model: db.phoneDetail,
            where: {
              quantity: {
                [Op.lte]: 5
              }
            }
          }
        ]
      });

      if(phones === null) {
        return res.status(400).json({ message: "Không thể tìm điện thoại"});
      }
      let phoneNumber = phones.count;
      let phoneWithOption = [];
  
      for(const phone of phones.rows) {
        let formatOption = {}
        const option = await db.phoneDetail.findAll({
          where: {
            phoneId: phone.id
          },
          include:[
            {
              model: db.color,
            }, {
              model: db.capacity
            }
          ],
          attributes: {
            exclude: ['colorId', 'capacityId'] // Add any fields you want to exclude here
          }, 
        })
        
        formatOption = {... 
          phone.toJSON(),
          option
        }
        phoneWithOption.push(formatOption)
      }
      return res.status(200).json({ phoneNumber, phoneWithOption});
    }
  } catch (error) {
    console.log(error)
  }
}

const updatePhone = async (req, res) => {
  try {
    const {phone} = req.body;

    const user = await db.user.findByPk(req.user.data.userId);

    if(!user.role) {
      return res.status(400).json({message: "Người dùng không thể thực hiện chức năng này !!"})
    }

    const phoneModel = await db.phone.findByPk(phone.id);

    if(!phoneModel) {
      return res.status(400).json({message: "Có lỗi rồi !!"})
    }

    //  update phone 
    phoneModel.mainImage = phone.mainImage;
    phoneModel.price = phone.price;

    // update option phone

    for (let option of phone.option) {
      let optionMd = await db.phoneDetail.findOne({
        where : {
          phoneId: phone.id,
          colorId: option.color.id,
          capacityId: option.capacity.id,
        }
      })
     
      if(!optionMd) {
        return res.status(400).json({message: "Có lỗi rồi !!"})
      }

      // update option
      optionMd.quantity = option.quantity;
      await optionMd.save();
    }
    
    await phoneModel.save();

    return res.status(200).json({message: "Cập nhật điện thoại thành công"})
  } catch (error) {
    console.log(error)
  }
}

const deletePhone = async (req, res) => {
  try {
    const {phone} = req.body;

    const user = await db.user.findByPk(req.user.data.userId);

    if(!user.role) {
      return res.status(400).json({message: "Người dùng không thể thực hiện chức năng này !!"})
    }

    const phoneModel = await db.phone.findByPk(phone.id)

    if(!phoneModel) {
      return res.status(400).json({message: "Có lỗi xảy ra!!"})
    }

    await phoneModel.destroy(); 

    return res.status(200).json({message: "xóa sản phẩm thành công"})
  } catch (error) {
    console.log(error)
  }
}

export default { createPhone, getAllPhone, getPhone, getAllPhoneAdmin, updatePhone, deletePhone};