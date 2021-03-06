const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const searchTxt = document.getElementById('search'); // adding for keyboard 'Enter' functionality
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const errorTxt = document.getElementById("error-txt"); // adding to get the div to display error message
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';


// show images 
const showImages = (images) => {
  if (images.length === 0) {
    searchError();  // displaying error if the response from the server is empty
    displaySpinner(false);  // to stop the spinner
  } else {
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
    displaySpinner(false);  // to stop the spinner
  }
}


const getImages = (query) => {
  if (query === "") {
    emptySearchError(); // displaying error message
  }
  else {
    displaySpinner(true); // to run the spinner
    clearErrorText(); // removing previous error message
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
      .then(response => response.json())
      .then(data => showImages(data.hits))
      .catch(err => console.log(err))
  }
}


// for accessing Keyboard "Enter" Button
searchTxt.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {  // comparing the keyboard key value
    searchBtn.click();  // adding event with search button
  }
})


let slideIndex = 0;
const selectItem = (event, img) => {

  let element = event.target;
  let item = sliders.indexOf(img);

  if (item === -1) {
    sliders.push(img);
    element.classList.toggle('added');
  } else {
    element.classList.toggle('added');
    // getting the index of the deselected image
    const index = sliders.indexOf(img);
    // removing the img using the splice
    if (index > -1) { sliders.splice(index, 1) };
  }
}


var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 images.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  let duration = document.getElementById('duration').value || 1000;

  // validation for negative input
  if (duration < 0) { 
    // displaying error message
    alert("Sorry, Interval Time Cannot be a Negative Value ! \nPlease Enter Again.");
    document.getElementById('duration').value = ""; // clearing the input text box
    imagesArea.style.display = 'block'; // keep the image area display style as block
  }
  else{
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100" src="${slide}" alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
}


// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}


// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}


searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})


// function to display error for empty search box
const emptySearchError = () => {
  errorTxt.innerText = "Please Enter Text into the Search Box !";
  galleryHeader.style.display = 'none'; // clearing the previous search
  gallery.innerHTML = "";
}


// function to display error, if the feedback for the server is empty / []
const searchError = () => {
  errorTxt.innerText = "Sorry, No Similar Data Found !";
  galleryHeader.style.display = 'none'; // clearing the previous search
  gallery.innerHTML = "";
}


// function to clear the previous error texts
const clearErrorText = () => {
  errorTxt.innerHTML = "";
}


// function to display and hide the spinner
const displaySpinner = (show) => {
  const spinner = document.getElementById("loading-spinner"); // getting the spinner div
  if(show){
    spinner.style.display = "block";  // to display
  }
  else{
    spinner.style.display = "none"; // to hide 
  }
}