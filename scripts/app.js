const homeBtn = document.querySelector(".home-btn");
const favBtn = document.querySelector(".fav-btn");
const search = document.getElementById("search");
const cards = document.querySelector(".cards-container");
const template = document.getElementById("card-template");
const loadSnackbar = document.getElementById("load-snack-bar");
const bottomSnackbar = document.getElementById("bottom-snackbar");
const pageTitle = document.querySelector(".page-title");

const baseUrl = "https://superheroapi.com/api/3888832094520145/";
let currID = null;

//Load Cards On Input Change
search.addEventListener("input", getCards);

function getCards() {
    if (search.value) {
        while (cards.hasChildNodes()) cards.removeChild(cards.lastChild); //Clear Previous Results
        const searchString = `search/${search.value}`;
        let url = baseUrl + searchString;
        getResponse(url);
    }
}

function getResponse(url, favorites = false) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        //Hide Loading SnackBar
        if (xhr.readyState === XMLHttpRequest.DONE)
            loadSnackbar.style.opacity = "0";

        //Show Loading SnackBar
        if (xhr.readyState === XMLHttpRequest.OPENED)
            loadSnackbar.style.opacity = "1";
    };

    xhr.open("GET", url);

    xhr.onerror = function() {
        console.log("Error");
    };

    xhr.onload = function() {
        responseJSON = JSON.parse(xhr.response);
        if (responseJSON.response === "success") {
            if (!favorites) {
                // Load Search Result Cards by Name
                while (cards.hasChildNodes()) cards.removeChild(cards.lastChild);
                results = responseJSON.results;
            } else {
                //Load Favorite Hero Card By ID
                results = [responseJSON];
            }
            // Load Cards
            for (result of results) {
                loadCard(result, favorites);
            }
            //Make Cards Navigate to Hero Page
            for (let card of cards.children) {
                card.addEventListener("click", viewHero);
            }
        } else if (responseJSON.response === "error")
            console.log(responseJSON.error);
    };

    xhr.send();
}

// Create Card From Template
function loadCard(result, favorites) {
    card = template.content.cloneNode(true);
    card.querySelector(".hero-name").textContent = result.name;
    card.querySelector(".hero-img").setAttribute("src", result.image.url);
    card.querySelector(".hero-id").value = result.id;
    fav = card.querySelector(".hero-fav");
    if (!favorites) fav.addEventListener("click", addToFavorites);
    else {
        //Remove From Favorites
        fav.firstElementChild.className = "fas fa-minus";
        fav.addEventListener("click", removeFromFavorites);
    }
    cards.appendChild(card);
}

//Add Card To Favorites
function addToFavorites(event) {
    const card = event.currentTarget.parentNode;
    const id = card.querySelector(".hero-id").value;
    addToStorage(id);
    event.stopPropagation();
}

//Add Card ID to Browser Storage
function addToStorage(id) {
    if (localStorage.heroes) {
        storedHeroes = JSON.parse(localStorage.getItem("heroes"));
        if (storedHeroes.indexOf(id) === -1) {
            storedHeroes.push(id);
            localStorage.setItem("heroes", JSON.stringify(storedHeroes));
            loadBottomSnackbar("Added To Favorites");
        } else {
            loadBottomSnackbar("Already in Favorites", "lightsalmon");
        }
    } else {
        heroes = [id];
        localStorage.setItem("heroes", JSON.stringify(heroes));
        loadBottomSnackbar("Added To Favorites");
    }
}

//Remove Card ID From Storage
function removeFromFavorites(event) {
    const card = event.currentTarget.parentNode;
    const id = card.querySelector(".hero-id").value;

    if (localStorage.heroes) {
        storedHeroes = JSON.parse(localStorage.getItem("heroes"));
        const idx = storedHeroes.indexOf(id);
        if (idx !== -1) {
            storedHeroes.splice(idx, 1);
            localStorage.setItem("heroes", JSON.stringify(storedHeroes));
            loadBottomSnackbar("Removed From Favorites", "lightsalmon");
        }
        event.stopPropagation();
        //Set Display To None; On re-rendering this card will not be included
        card.style.display = "none";
    }
}

//Store heroID in Browseer Storage and Navigate
function viewHero(event) {
    currID = event.currentTarget.querySelector(".hero-id").value;
    localStorage.setItem("heroID", currID);
}


//Message SnackBar
function loadBottomSnackbar(msg, color, duration) {
    console.log("snack");
    bottomSnackbar.textContent = msg;
    bottomSnackbar.style.backgroundColor = color || "ivory";
    bottomSnackbar.style.transform = "translate(-50%,25%)";
    dur = duration || 1000;
    setTimeout(() => {
        bottomSnackbar.style.transform = "translate(-50%,200%)";
    }, dur);
}