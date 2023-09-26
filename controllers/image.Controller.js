import cloudinary from '../helpers/upload.js';

export const upload = async (req, res) => {
  try {
    const { image } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(image,{
      upload_preset:"phone"
    })
    
    if(uploadResponse) {
      return res.status(200).json({ 
        public_id: uploadResponse.public_id,
        url: uploadResponse.url
      })
      
    }else {
      return res.status(400).json({ message: "Upload image false"})
    }

  } catch (error) {
   return res.status(400).json(error);
  }
};

export const remove = async (req, res) => {
  try {
    const { public_id } = req.body;
    
    const removeResponse = await cloudinary.uploader.destroy(public_id);
    
    if(removeResponse) {
      return res.status(200).json(removeResponse);
    }

    return res.status(400).json({message: "Some thing wrong!"});
  } catch (error) {
    return res.status(400).json(error);
  }
}