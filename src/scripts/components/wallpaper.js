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
        console.log(resultImg[img.id]);
        const pictureSelected = resultImg[img.id].large;
        updatePicture(pictureSelected);

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

export function updatePicture(image) {
  const header = document.querySelector("header");
  header.style.backgroundImage = `url(${image})`;
}

export async function callRandomPhoto() {
  const response = await fetch("./.netlify/functions/randomImg");
  if (response.ok) {
    const randomPicture = await response.json();
    return randomPicture;
  }
  return null;
}
