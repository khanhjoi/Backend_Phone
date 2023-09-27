import { where } from "sequelize";
import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;
    // check input
    if(!(firstName && lastName && email, phone, password)) {
      return res.status(400).json({ message: "Vui lòng nhập đủ dữ liệu!!!"})
    }
    // check old user
    let oldUser = await db.user.findOne({ where: { email: email } })
    if(oldUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại. Vui lòng đăng nhập"})
    }

    var salt = bcrypt.genSaltSync(10);
    var encryptedPassword = bcrypt.hashSync(password, salt);

    const user = await db.user.create({
      firstName,
      lastName,
      email,
      phone,
      role: role || false,
      password:encryptedPassword
    })
    
    const token = jwt.sign(
      {data: user.userId, email},
      process.env.TOKEN_KEY,
      {
        expiresIn: '2d'
      }
    )
  

    user.token = token,
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const login = async (req, res) => {
  try {
    
    const {email, password} = req.body;

    if(!(email && password)) {
      return res.status(200).json({message: "Vui lòng nhập đủ dữ liệu!!!"})
    }

    const user = await db.user.findOne({ where: { email: email }});

    console.log();

    if(user && (bcrypt.compareSync(password, user.password) )) {
      const token = jwt.sign(
        {data: user.id, email},
        process.env.TOKEN_KEY,
        {
          expiresIn: '2d'
        }
      )

      user.token = token;
      await user.save();
    
      return res.status(200).json(user);
    }

    return res.status(400).json({message : "Đăng nhập không hợp lệ"});
    
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const createUser = async (req, res) => {
  try {
    
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const user = await db.user.findByPk(req.params.id);

    if(!user) {
      return res.status(400).json({message : "Không thể tìm thấy người dùng này !!!"})
    }

    if(firstName) {
      user.firstName = firstName;
    }

    if(lastName) {
      user.lastName = lastName;
    }

    if(email) {
      const oldUser = db.user.findOne({where : {email: email}});

      if(oldUser) {
        return res.status(403).json({message: "Email đã có người xử dụng !!"});
      }

      user.email = email;
    }

    if(phone) {
      user.phone = phone
    }

    await user.save();
    // update address after

    return res.status(200).json(user);

  } catch (error) {
    return res.status(400).json(error)
  }
}

export const getAllUser = async (req, res) => {
  try {
    const user = await db.user.findOne({ where : {email: req.user.email}});

    if(!user.role) {
      return res.status(403).json({ message: "Người dùng không thể thực hiện chức năng này"});
    }

    const users = await db.user.findAll();

    return res.status(200).json(users);

  } catch (error) {
    return res.status(400).json(error)
  }
}

export const getUser = async (req, res) => {
  try {
    
    const user = await db.user.findByPk(req.params.id);

    if(!user) {
      return res.status(400).json({message : "Không thể tìm thấy người dùng này !!!"})
    }

    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await db.user.findByPk(userId);

    if(!user) {
      return res.status(400).json({message : "Không thể tìm thấy người dùng này !!!"})
    }

    const isOwner = await db.user.findOne({ where: { email: req.user.email }});

    if(!isOwner.role) {
      return res.status(400).json({ message: "Người dùng không sử dụng được chức năng này!!!"});
    }

    await user.destroy();

    return res.status(400).json({ message: "Xóa người dùng thành công!!!"}); 
  } catch (error) {
    return res.status(400).json(error)
  }
}