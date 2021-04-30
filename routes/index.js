const express = require('express');
const {getDonors, addDonor,loginDonor, getCoord,searchDonors, addBank,distDonor} = require('../controllers/Donor');

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('dashBoard')
})
router.get('/about',(req,res)=>{
    res.render('about')
})
router.get('/map/:id',(req,res)=>{
    res.render('map',{bg:req.params.id})
})
router.get('/register',(req,res)=>{
    res.render('register')
})
router.get('/search',(req,res)=>{
    res.render('search',{name:"NA" , err :"U bastard", msg:"Go home"})
})

router.get('/success',(req,res)=>{
    res.render('success/:id',{name : id})
})
router.post('/searchDonors',searchDonors)
router.post('/register', addDonor)
router.post('/addBank', addBank)
router.post('/login',loginDonor)
router.post('/getCoords',getCoord)
router.post('/showlist',distDonor)
module.exports = router;