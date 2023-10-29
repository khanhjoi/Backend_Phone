import db from '../models/index.js';
import { Op } from "sequelize";

export const getNumberPhones = async (req, res) => {
  try {
    const phones = await db.phone.findAndCountAll({
      include:[
        {
          model: db.phoneDetail,
        }
      ]
    });

    if(!phones) {
      return res.status(400).json({message: "Có lỗi xảy ra!"})
    }
    
    return res.status(200).json(phones)
  } catch (error) {
    console.log(error)
  }
}

export const getNumberPhoneAlarm = async (req, res) => {
  try {
    const phoneAlarm = await db.phoneDetail.findAndCountAll({
      where: {
        quantity: {
          [Op.lte]: 5
        }
      }
    })

    if(!phoneAlarm) {
      return res.status(400).json({message: "Có lỗi xảy ra!"})
    }

    return res.status(200).json(phoneAlarm)
  } catch (error) {
    console.log(error)
  }
}

export const getNumberOrder = async (req, res) => {
  try {
    const orders = await db.order.findAndCountAll({});

    if(!orders) {
      return res.status(400).json({message: "Có lỗi xảy ra!!"})
    }

    return res.status(200).json(orders)
  } catch (error) {
    console.log(error)
  }
}


export const getNumberOrderAccept = async (req, res) => {
  try {
    const orders = await db.order.findAndCountAll({
      where: {
        stateId: 1
      }
    });

    if(!orders) {
      return res.status(400).json({message: "Có lỗi xảy ra!!"})
    }

    return res.status(200).json(orders)
  } catch (error) {
    console.log(error)
  }
}

export const getInComeRevenue = async (req, res) => {
  try {
    const {selectedDateStart, selectedDateEnd} = req.body;
    const orders = await db.order.findAll({
      where: {
        createdAt: {
          [Op.between] : [selectedDateStart, selectedDateEnd]
        }
      }
    });

    if(!orders) {
      return res.status(400).json({message : "Có lỗi xảy ra"})
    }

    let income = 0;
    for( let order of orders) {
      income += order.totalPrice
    }

    return res.status(200).json(income)
  } catch (error) {
    console.log(error)
  }
}

