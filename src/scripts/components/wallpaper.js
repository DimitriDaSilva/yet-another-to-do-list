const backgroundBtn = document.querySelector("#top-section__background");
const backgroundPickerTemplate = document.querySelector("#background-image");

export function setBackgroundBtn() {
  backgroundBtn.addEventListener("click", createBackgroundPicker);
}

function createBackgroundPicker(e) {
  const backgroundPicker = document.importNode(
    backgroundPickerTemplate.content,
    true
  );
  const imgSearchBar = backgroundPicker.querySelector("input");
  const imageContainer = backgroundPicker.querySelector(
    ".background-image__container__images"
  );

  document.body.appendChild(backgroundPicker);

  imgSearchBar.focus();

  // We are setting the listener for the key strokes in the search-bar. The API calls will be done in real time
  imgSearchBar.addEventListener("keyup", callPhotos);

  function callPhotos() {
    async function success() {
      const resultImg = await fetch(
        `./.netlify/functions/searchImg?search=${imgSearchBar.value}`
      );
      if (resultImg.ok) {
        const photosUnsplash = await resultImg.json();
        setThumbnails(photosUnsplash);
        setListenersPictures(photosUnsplash);
      }
    }

    success();
  }

  function setThumbnails(resultImg) {
    imageContainer.textContent = "";
    let id = 0;
    resultImg.forEach((pic) => {
      const div = document.createElement("div");
      div.classList.add("background-image__container__images__img");
      const img = document.createElement("img");
      img.src = pic.thumbnail;
      img.id = id;
      div.appendChild(img);
      imageContainer.appendChild(div);
      id++;
    });
  }

  function setListenersPictures(resultImg) {
    document.addEventListener("click", setListenerAllsPictures, true);
    function setListenerAllsPictures(e) {
      const img = e.target;
      const div = img.parentElement;
      const classTargeted = "background-image__container__images__img";
      const hasClass = div.classList.contains(classTargeted);
      if (hasClass) {
        const pictureSelected = resultImg[img.id].large;
        setBackground(pictureSelected);

        // We are only saving the image in the background if the user has selected it
        localStorage.setItem("backgroundImage", pictureSelected);
      }
    }
  }

  // We are setting the listener for the click outside the background-image__container that will make it go away
  const container = document.querySelector(".background-image__container");
  window.addEventListener("mousedown", setListenerExit);
  function setListenerExit(e) {
    if (!container.contains(e.target)) {
      container.remove();
    }
  }
}

export function setBackground(img) {
  const backgroundImg = document.querySelector("#top-section__image");
  backgroundImg.onload = () => {
    setColorTopSection();
  };
  backgroundImg.src = img;
}

export function resizeBackground() {
  const header = document.querySelector("header");
  const backgroundContainer = document.querySelector(
    "#top-section__image-container"
  );

  const headerWidth = header.offsetWidth.toString() + "px";
  const headerHeight = header.offsetHeight.toString() + "px";

  backgroundContainer.style.width = headerWidth;
  backgroundContainer.style.height = headerHeight;

  setColorTopSection();
}

export function setResizeListener() {
  window.addEventListener("resize", resizeBackground);
}

export async function callRandomPhoto() {
  const response = await fetch("./.netlify/functions/randomImg");
  if (response.ok) {
    const randomPicture = await response.json();
    return randomPicture;
  }
  return null;
}

export function setColorTopSection() {
  const date = document.querySelector("#top-section__date");
  const darkModeBtn = document.querySelector("#top-section__dark-mode svg");
  const backgroundBtn = document.querySelector("#top-section__background svg");
  const elements = [date, darkModeBtn, backgroundBtn];

  elements.forEach((el) => {
    const position = getPosition(el);
    const backgroundColor = getColorFromBackground(position);
    const color = isLight(backgroundColor) ? "#444444" : "#cecece";

    el.style.color = color;
    el.style.fill = color;
    el.style.stroke = color;
  });
}

function getPosition(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
}

function getColorFromBackground(position) {
  const img = document.querySelector("#top-section__image");
  const canvas = document.createElement("canvas");

  canvas.width = img.offsetWidth;
  canvas.height = img.offsetHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return ctx.getImageData(position.x, position.y, 1, 1).data;
}

function isLight(rgb) {
  const luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  if (luma > 128) {
    return true;
  } else {
    return false;
  }
}
