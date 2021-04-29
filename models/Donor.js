const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const DonorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a Donor Name'],
    unique: true,
    trim: true,
  },
  email : {
    type: String,
    required:true
  },
  age : {
    type: Number,
    required:true
  },
  bloodGroup:{
    type: String,
    required:true
  },
  gender:{
    type: String,
    required:true
  },
  contact:{
    type: Number,
    required:true
  },
  weight:{
    type: Number,
    required:true
  },
  dateCovidPositive:{
    type: Date,
    required:true
  },
  daysAfterRecovery:{
    type: Number,
    required:true
  },
  haveAadhar:{
    type: String,
    required:true
  },
  haveHospitalReport:{
    type: String,
    required:true
  },
  address:{
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
DonorSchema.index({ location: "2dsphere" });
// Geocode & create location
DonorSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress
  };
  console.log(this.haveAadhar)
  // Do not save address
  this.address = undefined;
  next();
});

module.exports = mongoose.model('Donor', DonorSchema);