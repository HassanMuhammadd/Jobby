const multer = require("multer");


// Set up multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const fileName = `FILE-${Date.now()}.${ext}`;
        cb(null, fileName); // Set the filename
    },
  });

 const fileFilter = (req,file,cb)=>{
    const fileName = file.mimetype.split("/")[0];
    // const fileTypeResult = fileType(file.buffer);
    if((fileName==="image" || fileName==="application")){
        return cb(null,true);
    }
    else{
        return cb(new Error("Invalid file type"),false);
    }
}
const upload = multer({
    storage:storage,
    fileFilter
})

module.exports = {
    upload 
}