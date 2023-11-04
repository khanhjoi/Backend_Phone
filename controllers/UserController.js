import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    let { firstName, lastName, email, phone, password, gender ,role } = req.body ;
    // check input
    if(req.body.user) {
      console.log(req.body.user)
      firstName = req.body.user.firstName
      lastName = req.body.user.lastName
      email = req.body.user.email
      password = req.body.user.password
      phone = Number(req.body.user.phoneNumber)
      gender = req.body.user.gender
    }
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
      gender,
      role: role || false,
      password:encryptedPassword
    })

    const token = jwt.sign(
      {
        data: { userId: user.id, 
        email: email
      }
     },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h'
      }
    )
  

    user.token = token,
    await user.save();

    return res.status(200).json({message: "Đăng ký thành công !!"});
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

    if(user && (bcrypt.compareSync(password, user.password) )) {
      const token = jwt.sign(
        {
          data: { 
            userId: user.id, 
            email: email
          }
       },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h'
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
    console.log(req.body)
    const {id, firstName, lastName, email, phone, password } = req.body.user;
    const userId = req.user.data.userId;
    const user = await db.user.findByPk(userId);

    if(!user.role) {
      return res.status(400).json({message : "Người dùng không thể thực hiện chức năng này !!!"})
    }

    // tìm người dùng trong data
    const userEdit = await db.user.findByPk(id);

    if(!userEdit) {
      return res.status(400).json({message : "Không thể tìm được người dùng này !!!"})
    }

    if(firstName) {
      userEdit.firstName = firstName;
    }

    if(lastName) {
      userEdit.lastName = lastName;
    }

    if (email && userEdit.email !== email) {
      const oldUser = await db.user.findOne({ where: { email: email } });
    
      if (oldUser !== null) {
        return res.status(403).json({ message: "Email đã có người xử dụng !!" });
      }
    
      userEdit.email = email;
    }

    if(phone) {
      userEdit.phone = phone
    }

    if(password) {
      var salt = bcrypt.genSaltSync(10);
      var encryptedPassword = bcrypt.hashSync(password, salt);
      userEdit.password = encryptedPassword
    }

    await userEdit.save();

    return res.status(200).json({success: "cập nhật thông tin thành công!!!"});
  } catch (error) {
    return res.status(400).json(error)
  }
}

export const getAllUser = async (req, res) => {
  try {
    const user = await db.user.findOne({ where : {email: req.user.data.email}});

    if(!user.role) {
      return res.status(403).json({ message: "Người dùng không thể thực hiện chức năng này"});
    }

    const users = await db.user.findAll({
      include: [
        {
          model: db.address
        }
      ]
    });

    if(!users) {
      return res.status(400).json({message : "Có lỗi xảy ra!!!"});

    } 

    return res.status(200).json(users);

  } catch (error) {
    return res.status(400).json(error)
  }
}

export const getUser = async (req, res) => {
  try {
    
    const user = await db.user.findByPk(req.user.data.userId, {
      include: [
        {
          model: db.address
        }
      ]
    });

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
    const  userId  = req.body.userId;
    const user = await db.user.findByPk(userId);

    if(!user) {
      return res.status(400).json({message : "Không thể tìm thấy người dùng này !!!"})
    }

    const isOwner = await db.user.findOne({ where: { email: req.user.data.email }});

    if(!isOwner.role) {
      return res.status(400).json({ message: "Người dùng không sử dụng được chức năng này!!!"});
    }

    await user.destroy();

    return res.status(200).json({ message: "Xóa người dùng thành công!!!"}); 
  } catch (error) {
    return res.status(400).json(error)
  }
}