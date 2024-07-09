const Events = require('../Models/EventModel');
const cloudinary = require("cloudinary").v2;

async function uploading(file, folder) {
    const options = {
        folder,
    };

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Create a new event
exports.UploadEventDetails = async (req, res) => {
    try {
        const imgFile = req.files.imgFile;
        const { title, subtitle } = req.body;

        if ( !imgFile || !title || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required details",
            });
        }

        const uploadedImage = await uploading(imgFile, 'Foundation');

        const newRecord = await new Events({
            title,
            subtitle,
            imageUrl: uploadedImage.secure_url,
            cloudinary_name: uploadedImage.public_id,
        }).save();

        return res.status(200).json({
            success: true,
            msg: "Event uploaded successfully",
            data: newRecord,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error creating event' });
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Events.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};
