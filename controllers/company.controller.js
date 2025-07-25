
import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "This company is already registered.",
                success: false
            });
        }

        

        const company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Error in registerCompany:", error); // Log full error
        return res.status(500).json({
            message: "Server error while registering company.",
            success: false
        });
    }
};

//get login id...>>>
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; //logged in user id 
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
//get company by id..>>
export const getCompanyBYId = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

//update company...>>

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const file = req.file;
        //yaha par couldinary ayega....>>
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = { name, description, website, location, logo};

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new: true});
        if(!company){
            return res.status(404).json({
                message:"Company not found.",
                success:false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
};


//agar upar wala nahi chala to ye try karna
// export const updateCompany = async (req, res) => {
//   try {
//     const { name, description, website, location } = req.body;
//     const file = req.file;

//     let logo;
//     if (file) {
//       const fileUri = getDataUri(file);
//       const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
//       logo = cloudResponse.secure_url;
//     }

//     const updateData = { name, description, website, location };
//     if (logo) updateData.logo = logo;

//     const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!company) {
//       return res.status(404).json({
//         message: "Company not found.",
//         success: false
//       });
//     }

//     return res.status(200).json({
//       message: "Company information updated.",
//       success: true
//     });
//   } catch (error) {
//     console.error("Error in updateCompany:", error);
//     return res.status(500).json({
//       message: "Server error while updating company.",
//       success: false
//     });
//   }
// };
