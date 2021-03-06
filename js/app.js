'use strict';

// Global varables
const mainElem = document.getElementById('main');
const h2Elem = document.getElementById('h2');
const roundElem = document.getElementById('round');
const leftImgElem = document.getElementById('leftImg');
const leftNameElem = document.getElementById('leftName');
const midImgElem = document.getElementById('midImg');
const midNameElem = document.getElementById('midName');
const rightImgElem = document.getElementById('rightImg');
const rightNameElem = document.getElementById('rightName');
let leftProduct = null;
let midProduct = null;
let rightProduct = null;
// set the number of rounds and counting rounds
let round = 10;
let roundCounter = 0;

h2Elem.textContent = `Please select your favoriate product by clicking the image.You will see ${round} rounds of products.`;


Product.allProducts = [];


// object constructor function

function Product(name, imgPath){
  this.name = name;
  this.imgPath = imgPath;
  this.shows = 0;
  this.clicked = 0;
  Product.allProducts.push(this);
}

// render single product

Product.prototype.renderProduct = function(namePosition, imgPosition) {
  namePosition.textContent = this.name;
  imgPosition.src = this.imgPath;
  this.shows++;
}

// random index generator

function randomIndex () {
  return Math.floor(Math.random() * Product.allProducts.length);
}
// creating a function randomly generates products and making sure not repeat twice in a row

function productToShow(){
  let currentProducts = [leftProduct, midProduct, rightProduct];

  while (currentProducts.includes(leftProduct)) {
    let index = randomIndex();
    leftProduct = Product.allProducts[index];
  }
  currentProducts.push(leftProduct);

  while (currentProducts.includes(midProduct)) {
    let index = randomIndex();
    midProduct = Product.allProducts[index];
  }
  currentProducts.push(midProduct);

  while (currentProducts.includes(rightProduct)) {
    let index = randomIndex();
    rightProduct = Product.allProducts[index];
  }
  currentProducts.push(rightProduct);

  leftProduct.renderProduct(leftNameElem, leftImgElem);
  midProduct.renderProduct(midNameElem, midImgElem);
  rightProduct.renderProduct(rightNameElem, rightImgElem);
  roundCounter++;
  roundElem.innerHTML = '';
  roundElem.textContent = `Round Number ${roundCounter}`;
}

// showing result button

function createResultButton() {
  const buttonElem = document.createElement('button');
  buttonElem.textContent = 'View Results';
  mainElem.appendChild(buttonElem);
}

// handle click function

function handleClick(event){
  let id = event.target.id;
  if (id === 'leftImg' || id === 'midImg' || id === 'rightImg') {
    if( id === 'leftImg' ){
      leftProduct.clicked++;
      // alert('left product is selected');
    } else if(id === 'midImg' ){
      midProduct.clicked++;
      // alert('middle product is selected');
    } else if (id === 'rightImg'){
      rightProduct.clicked++;
      // alert('right product is selected');
    }
    if (roundCounter < round){
      productToShow();
    } else {
      createResultButton();
      mainElem.removeEventListener('click', handleClick);
      mainElem.addEventListener('click', showResults);
    }
  } else{
    alert('Please click the prodcut image!');
  }
}

// store results in local storage
function storeResults() {
  let resultsStringified = JSON.stringify(Product.allProducts);
  localStorage.setItem('results', resultsStringified);
}

// access the previously stored local storage
function checkResults(){
  let checkData = localStorage.getItem('results');
  if (checkData){
    let storedResults = JSON.parse(checkData);
    //renderResults(storedResults);
    return storedResults;
  }
}

// merge previous results and current results by adding up number of shows and clicked
function mergeResults(){
  let previousResults = checkResults();
  if(previousResults){
    for(let currentProduct of Product.allProducts){
      for(let previousProduct of previousResults){
        if(currentProduct.name === previousProduct.name){
          currentProduct.shows += previousProduct.shows;
          currentProduct.clicked += previousProduct.clicked;
        }
      }
    }
    localStorage.removeItem('results');
  }

}

function showResults(event) {
  mergeResults();
  let text = event.target.textContent;
  if(text === 'View Results'){
    for(let product of Product.allProducts){
      if (product.clicked > 0){
        const pElem = document.createElement('p');
        pElem.textContent = `${product.name} had ${product.clicked} votes, and was seen ${product.shows} times.`;
        mainElem.appendChild(pElem);
      }
    }

  
    mainElem.removeEventListener('click', showResults);
    
    storeResults();
    addResultChart();
  }
}

// function to add a chart

function addResultChart() {
  const productNames = [];
  const productClicked = [];
  const productShown = [];

  for (let product of Product.allProducts){
    productNames.push(product.name);
    productClicked.push(product.clicked);
    productShown.push(product.shows);
  }

  const ctx = document.getElementById('productChart').getContext('2d');

  const productChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productNames,
      datasets: [{
        label: '# of Votes',
        data: productClicked,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderWidth: 1
      }, {
        label: '# of Shown',
        data: productShown,
        backgroundColor: [
          
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 0.2)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      
      scales: {
        y: {
          stepSize: 1,
          beginAtZero: true
        }
      }
    }
  });

}

// add event listener for clicking product

mainElem.addEventListener('click', handleClick);

// input all the products
function createProducts() {
  new Product('bag', './img/bag.jpg');
  new Product('banana', './img/banana.jpg');
  new Product('bathroom', './img/bathroom.jpg');
  new Product('boots', './img/boots.jpg');
  new Product('breakfast', './img/breakfast.jpg');
  new Product('bubblegum', './img/bubblegum.jpg');
  new Product('chair', './img/chair.jpg');
  new Product('cthulhu', './img/cthulhu.jpg');
  new Product('dog-duck', './img/dog-duck.jpg');
  new Product('dragon', './img/dragon.jpg');
  new Product('pen', './img/pen.jpg');
  new Product('pet-sweep', './img/pet-sweep.jpg');
  new Product('scissors', './img/scissors.jpg');
  new Product('shark', './img/shark.jpg');
  new Product('sweep', './img/sweep.png');
  new Product('tauntaun', './img/tauntaun.jpg');
  new Product('unicorn', './img/unicorn.jpg');
  new Product('water-can', './img/water-can.jpg');
  new Product('wine-glass', './img/wine-glass.jpg');
}
createProducts();
productToShow();
