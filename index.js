const slides = document.querySelector("#slides");
const slider = document.querySelector("#slider");
const mainImage = document.querySelector(".main-image");
const thumbnailsBox = document.querySelector("#thumbnails");

const leftButton = document.querySelector("#left");
const rightButton = document.querySelector("#right");

const max = slides.children.length;
let index = 0;
let interval;

for (let i = 0; i < max; i++) {
    let img=document.createElement("img");
    img.src=`images/${i + 1}.jpg`;
    img.classList.add("thumbnail");
    img.addEventListener("click",function(){
        changeImage(i); 
    });
    thumbnailsBox.appendChild(img);
}
function updateSlide() {
    slides.style.transform = `translateX(-${index * 100}%)`;

    let thumbnails = document.querySelectorAll(".thumbnail");

    thumbnails.forEach(function (img) {
        img.classList.remove("active");
    });

    thumbnails[index].classList.add("active");
    thumbnails[index].scrollIntoView({//secinlen seklin ekrana gelmesi ucun
        behavior: "smooth",
        block: "nearest",
        inline: "nearest"
    });
}

function changeImage(i) {
    index = i;
    updateSlide();
}

function right() {
    index++;

    if (index >= max) {
        index = 0;
    }

    updateSlide();
}

function left() {
    index--;

    if (index < 0) {
        index = max - 1;
    }

    updateSlide();
}


function Slide() {
    clearInterval(interval);

    interval = setInterval(function () {
        right();
    }, 2000);
}

rightButton.addEventListener("click", right);
leftButton.addEventListener("click", left);

slider.addEventListener("mouseenter", function () {
    clearInterval(interval);
});

slider.addEventListener("mouseleave", function () {
    Slide();
});

let isDraggingMain = false;
let startX = 0;
let moveX = 0;

mainImage.addEventListener("pointerdown", function (e) {
    if (e.target.closest("button")) return;

    isDraggingMain = true;
    startX = e.clientX;
    moveX = 0;

    slides.style.transition = "none";
    mainImage.setPointerCapture(e.pointerId);
});

mainImage.addEventListener("pointermove", function (e) {
    if (!isDraggingMain) return;

    moveX = e.clientX - startX;

    slides.style.transform =
        `translateX(calc(-${index * 100}% + ${moveX}px))`;
});

mainImage.addEventListener("pointerup", function () {
    if (!isDraggingMain) return;

    isDraggingMain = false;
    slides.style.transition = "transform 0.4s ease";

    if (moveX < -mainImage.offsetWidth * 0.2) {
        right();
    }
    else if (moveX > mainImage.offsetWidth * 0.2) {
        left();
    }
    else {
        updateSlide();
    }
});

mainImage.addEventListener("pointercancel", function () {
    isDraggingMain = false;
    slides.style.transition = "transform 0.4s ease";
    updateSlide();
});

let isDraggingThumbs = false;
let thumbStartX = 0;
let thumbScrollLeft = 0;

thumbnailsBox.addEventListener("mousedown", function (e) {
    isDraggingThumbs = true;

    thumbStartX = e.pageX;
    thumbScrollLeft = thumbnailsBox.scrollLeft;
});

thumbnailsBox.addEventListener("mousemove", function (e) {
    if (!isDraggingThumbs) return;

    e.preventDefault();

    let move = e.pageX - thumbStartX;

    thumbnailsBox.scrollLeft = thumbScrollLeft - move;
});

thumbnailsBox.addEventListener("mouseup", function () {
    isDraggingThumbs = false;
});

thumbnailsBox.addEventListener("mouseleave", function () {
    isDraggingThumbs = false;
});

updateSlide();
Slide();
