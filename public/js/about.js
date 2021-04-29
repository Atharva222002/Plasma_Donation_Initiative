var social = document.getElementById("social");
var myths = document.getElementById("myths");
 
var socialbtn = document.getElementById("socialbtn");
var mythsbtn = document.getElementById("mythsbtn");



socialbtn.addEventListener('click',()=>{
    myths.style.visibility = 'hidden';
    social.style.display = 'block';
    mythsbtn.className = 'c';
    socialbtn.className = 'tag';
})

mythsbtn.addEventListener('click' ,()=>{
    social.style.display = 'none';
    myths.style.visibility = 'visible';
    socialbtn.className = 'c';
    mythsbtn.className = 'tag';
})
