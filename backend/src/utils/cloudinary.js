import {v2 as cloudinary} from "cloudinary"
import 'dotenv/config'
import fs from "fs"


cloudinary.config({ 
    cloud_name: 'dagrkolqn', 
    api_key: '627636817196889', 
    api_secret: 'SvpvYwWoq1rjSCKwKYW-C158ZxU' 
});


// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET 
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded successfull
//         console.log("file is uploaded on cloudinary ", response.url);
//         fs.unlinkSync(localFilePath)
//         return response;

//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//         // console.log("error is", error);
        
//     }
// }


async function uploadOnCloudinary(file) {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
  
    return result;
  }




export {uploadOnCloudinary}