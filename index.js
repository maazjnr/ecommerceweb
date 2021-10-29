// grabs reference to elements
const drawer = document.querySelector(".drawer");
const overlay = document.querySelector(".body-overlay");
const basket = document.querySelector(".cart-modal");
const quantityAdded = document.querySelector(".quantity");
const cartItemsList = document.querySelector(".cart-items-list");
const emptyCartText = document.querySelector(".empty-cart-text");
const cartContent = document.querySelector(".cart-content");
const cartItemQuantity = document.querySelector(".cart-item-quantity");
const cartItemTotalPrice = document.querySelector(".cart-item-total-price");
const productImages = document.querySelectorAll(".product-images-slider");
const thumbnailNavigator = document.querySelectorAll(".thumbnail-navigator");
const lightbox = document.querySelector(".light-box");
const lightboxClose = document.querySelector(".light-box-close");
const badge = document.querySelector(".badge");
const deleteFromCart = document.querySelector(".delete-form-cart-icon");
const addToCartButton = document.querySelector(".add-to-cart-btn")
// get computed styles
const bodyStyles = window.getComputedStyle(document.body);

//implement drawer open close
let drawerIsOpen = false;
const drawerOpen = () =>{
    drawerIsOpen = true;
    drawer.style.left = 0;
    overlay.style.zIndex = 60;
    overlay.style.background = "rgba(0,0,0,.7)";
    document.body.style.overflow = 'hidden';
}

const drawerClose = () =>{
    drawer.style.left = "-75%";
    overlay.style.zIndex = -1;
    overlay.style.background = "";
    document.body.style.overflow = "";
}

// basket open-close
let basketIsOpen = false;
let basketItemsCount = 0;
const openAndCloseBasket = () =>{
    basketIsOpen = !basketIsOpen;
    if(basketIsOpen){
        basket.style.display = "block";
    }
    else{
        basket.style.display = "none";
    }      
    // check for content
    if (basketItemsCount == 0){
        cartContent.style.display = "none";
        emptyCartText.style.display = "block";
    }    
    else{
        emptyCartText.style.display = "none";
        cartContent.style.display = "block";    
    }    
}

// quantity selector
let quantity = 0;

//enable disable add-to-cart button
const updateAddtoCartButtonStatus = ()=>{
    if(quantity == 0)
        addToCartButton.disabled = true;
    else
        addToCartButton.disabled = false;    
}

updateAddtoCartButtonStatus();

const deacreaseQuantity = () =>{
    if(quantity > 0)
        quantity -= 1;   
    quantityAdded.innerHTML = quantity;
    updateAddtoCartButtonStatus();    
}

const increaseQuantity = () =>{
    quantity += 1;
    quantityAdded.innerHTML = quantity;
    updateAddtoCartButtonStatus()
}

//calculate total price for the item selcted
const calculatePrice = () =>{
    cartItemTotalPrice.innerHTML = "$"+ basketItemsCount * 125;
}

//add-to-cart
const addToCart = () =>{
    if(quantity == 0) return;
    basketItemsCount = quantity;
    cartItemQuantity.innerHTML = basketItemsCount;
    badge.style.display = "flex";
    badge.innerHTML = basketItemsCount;
    quantityAdded.innerHTML = 0;
    quantity = 0;
    calculatePrice();
    openAndCloseBasket();
    openAndCloseBasket();
    updateAddtoCartButtonStatus();
}

// delete items from cart
deleteFromCart.addEventListener("click",(e)=>{
    if(basketItemsCount == 1){
        checkout();
    }
    if(basketItemsCount > 0)
        basketItemsCount -= 1;
    cartItemQuantity.innerHTML = basketItemsCount;
    badge.innerHTML = basketItemsCount;
    calculatePrice();
})

// check out 
const checkout = () =>{
    basketIsOpen = !basketIsOpen;
    basketItemsCount = 0;
    quantity = 0;
    basket.style.display = "none";
    badge.style.display = "none";
}

// image slider
let lightboxIsOpen = false;
let activeSlider = lightboxIsOpen ? 0 : 1;

// align slides horizontaly
const alignSlides = (elem) =>{
    let slides = Array.from(elem.children);
    slides.forEach((slide,index) =>{
        slide.style.left =  `calc(100% * ${index})`
        slide.position = index;
    })
}
productImages.forEach(item => alignSlides(item));

// select current slide
let currentSlide = productImages[activeSlider].querySelector(".current-slide");
let slides = Array.from(productImages[activeSlider].children);
let ActiveThumbs =()=> Array.from(thumbnailNavigator[activeSlider].children);

// reflect current slider position on the thumblail selectors
const reflectOnThumbSlider = (prev,current) =>{
    let prevThumb = ActiveThumbs()[prev.position];
    let currentThumb = ActiveThumbs()[current.position];
    // style selected thumb
    currentThumb.style.border = ` 3px solid ${bodyStyles.getPropertyValue('--primary-orange')}`; 
    currentThumb.style.opacity = .7;
    // remove styles from previous thumb
    prevThumb.style.border = "";
    prevThumb.style.opacity = "";
}

// move slider
const moveSlider = (currentSlide,nextSlide)=>{
    currentSlide.classList.remove("current-slide");
    nextSlide.classList.add("current-slide");
    productImages[activeSlider].style.transform = `translateX(calc(100% * ${nextSlide.position * -1}))`
    reflectOnThumbSlider(currentSlide,nextSlide);
}

//slide back with the arrow
const slideBack = () =>{
    if(!currentSlide.previousElementSibling) return;
    moveSlider(currentSlide,currentSlide.previousElementSibling);
    currentSlide = currentSlide.previousElementSibling;
}

//slide forward with the arrow
const slideForward = () =>{
    if(!currentSlide.nextElementSibling) return;
    moveSlider(currentSlide,currentSlide.nextElementSibling);
    currentSlide = currentSlide.nextElementSibling;
}

// use thumbails to slide
//Adding event listner to all thumbs
const ActivateThumbs = (thumbs) =>{
    thumbs.forEach((thumb,index) =>{
        thumb.addEventListener('click',(e)=>{
            moveSlider(currentSlide,slides[index]);
            currentSlide = slides[index];
        })
    })
}

thumbnailNavigator.forEach(set =>{
    let thumbs = Array.from(set.children);
    ActivateThumbs(thumbs);
})

//add event listner to the big images to open lightbox
Array.from(productImages[1].children).forEach((image,index) =>{
    image.addEventListener("click",(e)=>{
        if(window.screen.width > 799)
            openLightBox(index);
    })
})


// light-box open close
const openLightBox = (index)=>{
    lightboxIsOpen = true;
    lightbox.style.display = "flex";
    document.body.style.overflowY = "hidden";
    reflectOnThumbSlider(currentSlide,currentSlide);
    activeSlider = 0;
    moveSlider(currentSlide,currentSlide);
}
lightboxClose.addEventListener('click',(e)=>{
    lightbox.style.display = "none";
    lightboxIsOpen = false;
    reflectOnThumbSlider(currentSlide,currentSlide);   
    activeSlider = 1;
    document.body.style.overflowY = "";
})
