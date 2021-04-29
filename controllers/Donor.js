const Donor = require('../models/Donor');
const BloodBank = require('../models/BloodBank');
const geocoder = require('../utils/geocoder');
// @desc  Get all Donors
// @route GET /api/v1/Donors
// @access Public
exports.searchDonors = async (req, res, next) => {
  try {
    const Donors = await Donor.find({bloodGroup:req.body.bloodgroup})
    const Banks = await BloodBank.find()
    return res.status(200).json({
      success: true,
      data: {donors:Donors,banks:Banks}
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error'});
  }
};


exports.distDonor = async (req, res, next) => {
  try {
    const list=await Donor.find({
      bloodGroup:req.body.bloodgroup,
      location: {
       $near: {
        $maxDistance: req.body.dist,
        $geometry: {
         type: "Point",
         coordinates: [req.body.lng, req.body.lat]
        }
       }
      }
     })
     const list1=await BloodBank.find({
      location: {
       $near: {
        $maxDistance: req.body.dist,
        $geometry: {
         type: "Point",
         coordinates: [req.body.lng, req.body.lat]
        }
       }
      }
     })
    return res.status(200).json({
      success: true,
      data: {
        donorslist:list,
        banklist:list1
      }
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error'});
  }
};


// @desc  Create a Donor
// @route POST /api/v1/Donors
// @access Public
exports.addDonor = async (req, res, next) => {
  try {
    const Donor1 = await Donor.create(req.body);

    return res.status(201).json({
      success: true,
      data: Donor1
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This Donor already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addBank = async (req, res, next) => {
  try {
    console.log(req.body)
    const Bank = await BloodBank.create(req.body);

    return res.status(201).json({
      success: true,
      data: Bank
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This Bank already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports.loginDonor = async (req, res) => {
    var user = await Donor.findOne({ "email": req.body.email})
    if (user) {
        if(user.password===req.body.password)
        {
          res.send("Success!");
        }
        else{
          res.send("Incorrect Password!!");
        }
    }
    else {
        res.send("Not Registered!!");
    }
}

module.exports.getCoord=async(req,res)=>{
  const loc = await geocoder.geocode(req.body.address);
  res.send({"longitude":loc[0].longitude,"latitude":loc[0].latitude})
}