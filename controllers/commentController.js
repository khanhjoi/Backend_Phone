import db from "../models/index.js";

export const addComment =  async (req, res) => {
  try {
    const {star, comment} = req.body;
    console.log(req.body)
    if(!star) {
      return res.status(400).json({message: "phải đánh giá số sao"})
    }
    const user = await db.user.findByPk(req.user.data.userId);
    const phone = await db.phone.findByPk(req.params.id,{
      include: [
        {
          model: db.rate
        }
      ]
    });

    const rate = await db.rate.create({
      userId: user.id,
      phoneId: phone.id,
      star: star,
      comment: comment || null,
    })

    return res.status(200).json({message : "Bình luận thành công!!"})
  } catch (error) {
    return res.status(200).json(error);
  }
}

export const updateComment =  async (req, res) => {
  try {
    const {start, comment} = req.body;

    if(!start) {
      return res.status(400).json({message: "phải đánh giá số sao"})
    }

    const rate = await db.rate.findByPk(req.params.rateId);

    rate.start = start,
    rate.comment = comment || rate.comment;

    await rate.save();

    return res.status(200).json(rate);
  } catch (error) {
    return res.status(200).json(error);
  }
}

export const deleteComment =  async (req, res) => {
  try {
    const rate = await db.rate.findByPk(req.params.rateId);
    await rate.destroy();
    return res.status(200).json({message : "Xóa thành công !!"})
  } catch (error) {
    return res.status(200).json(error);
  }
}