function checkotCart() {
  window.location.href = './checkout.html';
}
// mange header color select defuclte
document.getElementById('eye-header').style.color = '#790000';
// mange sections select defuclte
document.getElementById('eyeglasses').style.display = 'block';
document.getElementById('sunglasses').style.display = 'none';
document.getElementById('accglasses').style.display = 'none';
document.getElementById('brandglasses').style.display = 'none';

// mange sections and color
function eyelShop() {
document.getElementById('eye-header').style.color = '#790000';
document.getElementById('men-header').style.color = '#000';
document.getElementById('contact-header').style.color = '#000';
document.getElementById('acces-header').style.color = '#000';

document.getElementById('eyeglasses').style.display = 'block';
document.getElementById('sunglasses').style.display = 'none';
document.getElementById('accglasses').style.display = 'none';
document.getElementById('brandglasses').style.display = 'none';
}
function sunlShop() {
  document.getElementById('eye-header').style.color = '#000';
  document.getElementById('men-header').style.color = '#790000';
  document.getElementById('contact-header').style.color = '#000';
  document.getElementById('acces-header').style.color = '#000';
  
  document.getElementById('eyeglasses').style.display = 'none';
  document.getElementById('sunglasses').style.display = 'block';
  document.getElementById('accglasses').style.display = 'none';
  document.getElementById('brandglasses').style.display = 'none';
}
function accshop() {
  document.getElementById('eye-header').style.color = '#000';
  document.getElementById('men-header').style.color = '#000';
  document.getElementById('contact-header').style.color = '#790000';
  document.getElementById('acces-header').style.color = '#000';
  
  document.getElementById('eyeglasses').style.display = 'none';
  document.getElementById('sunglasses').style.display = 'none';
  document.getElementById('accglasses').style.display = 'block';
  document.getElementById('brandglasses').style.display = 'none';
}
function brandshop() {
  document.getElementById('eye-header').style.color = '#000';
  document.getElementById('men-header').style.color = '#000';
  document.getElementById('contact-header').style.color = '#000';
  document.getElementById('acces-header').style.color = '#790000';
  
  document.getElementById('eyeglasses').style.display = 'none';
  document.getElementById('sunglasses').style.display = 'none';
  document.getElementById('accglasses').style.display = 'none';
  document.getElementById('brandglasses').style.display = 'block';
}

// home
if (localStorage.getItem('homeToShop') === 'brand') {
  brandshop()
}
if (localStorage.getItem('homeToShop') === 'acc') {
  accshop()
}
if (localStorage.getItem('homeToShop') === 'eye') {
  eyelShop()
}
if (localStorage.getItem('homeToShop') === 'sun') {
  sunlShop()
}













