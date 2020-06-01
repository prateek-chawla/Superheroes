renderFavPage();

function renderFavPage() {
    //Highlight Fav Navigation Button
    favBtn.firstElementChild.style.color = "crimson";
    homeBtn.firstElementChild.style.color = "black";
    //Change Page Title
    pageTitle.textContent = "Favorites";
    //Remove Search Box
    search.style.display = "none";

    renderFavHeroes();
}

function renderFavHeroes() {
    //Remove Existing Cards If Any
    while (cards.hasChildNodes()) cards.removeChild(cards.lastChild);
    if (localStorage.heroes) {
        favorites = JSON.parse(localStorage.getItem("heroes"));
        console.log(favorites);
        for (heroID of favorites) {
            let url = baseUrl + heroID;
            console.log(url);
            getResponse(url, true);
        }
    }
}