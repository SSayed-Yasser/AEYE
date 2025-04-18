function checkotCart() {
  window.location.href = './checkout.html';
}

//scroling
const scrollContainer = document.getElementById('scroll-content');
function scrollContentLeft() {
  scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
}
function scrollContentRight() {
  scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
}

//scroling 2
const scrollContainer2 = document.getElementById('scroll-content2');
function scrollContentLeft2() {
  scrollContainer2.scrollBy({ left: -300, behavior: 'smooth' });
}
function scrollContentRight2() {
  scrollContainer2.scrollBy({ left: 300, behavior: 'smooth' });
}

//scroling 3
const scrollContainer3 = document.getElementById('scroll-content3');
function scrollContentLeft3() {
  scrollContainer3.scrollBy({ left: -300, behavior: 'smooth' });
}
function scrollContentRight3() {
  scrollContainer3.scrollBy({ left: 300, behavior: 'smooth' });
}


//def
document.getElementById('all-glasses-header').style.color = '#790000';
function brandshop() {
  localStorage.setItem('homeToShop', 'brand');
  window.location.href = './shop.html';
}
function eyelShop() {
  localStorage.setItem('homeToShop', 'eye');
  window.location.href = './shop.html';
}
function sunlShop() {
  localStorage.setItem('homeToShop', 'sun');
  window.location.href = './shop.html';
}
function accshop() {
  localStorage.setItem('homeToShop', 'acc');
  window.location.href = './shop.html';
}
function kidshop() {
  localStorage.setItem('homeToShop', 'eye');
  window.location.href = './shop.html';
}
function menshop() {
  localStorage.setItem('homeToShop', 'eye');
  window.location.href = './shop.html';
}
function womenshop() {
  localStorage.setItem('homeToShop', 'eye');
  window.location.href = './shop.html';
}
function settings() {
  localStorage.setItem('homeToShop', 'acc');
  window.location.href = './settings.html';
}