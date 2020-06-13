const db = require("../models/db");
const fetch = require("../functions/fetchFunc");
const uploader = require('cloudinary').uploader;
const dataUri = require('../functions/multer').dataUri;

module.exports.getAssignments = async (req, res) => {
  try {
    // Extract user id after authenticating
    const id = req.user.id;
    // Find complaint using fk login_id
    const assignmentData = await db.public.assignments.findAll({
      where: { login_id: id },
      attributes: [
        "assignment_id",
        "course_name",
        "date_due",
        "updated_at",
        "created_at",
      ],
      /* include: [{
                model: db.public.images,
                attributes: ['image']
            }] */
    });
    return res.status(200).json({
      success: true,
      assignments: assignmentData, // If null, front-end should show no current compaints
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

module.exports.createAssignment = async function (req, res) {
  try {
    // get request_body
    const assignment = req.body;
    // const images = req.body.images;
    //change code for user_id
    assignment.login_id = req.user.id;
    
    console.log('1:', assignment.login_id)
    console.log('2:', req.user.id)

    const newAssignment = await db.public.assignments
      .create(assignment, { returning: true })
      .then((assignmentData) => {
        const assignment_data = {
          course_name: assignmentData.course_name,
          assignment_id: assignmentData.assignment_id,
          date_due: assignmentData.date_due,
        };
        return res.status(200).json({
          success: true,
          assignment: assignment_data,
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

module.exports.deleteAssignment = async function (req, res) {
    // get request_body
    const assignment_id = req.body.assignment_id;
    const id = req.user.id;
    // const images = req.body.images;
    //change code for user_id
    
    await db.public.assignments.destroy({ where: { assignment_id: assignment_id, login_id: id } }).then(() => {
      return res.status(200).json({
        msg: "Assignment deleted successfully.",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Internal server error",
      });
    })
};


module.exports.uploadImage = (req,res)=>{
  console.log('req.body:', req.file)
  if(req.file){
    var file = dataUri(req).content;
    console.log("uploading..");
    return uploader.upload(file).then((result)=>{
      console.log("Image Uploaded:", result.url);
      return res.json({
        success:"true",
        image_path: result.url,
      })
    }).catch((error)=>{
        console.log(error);
        return res.json({
          message:"Image not uploaded",
          error
        })
    })  
  }
}
