const heroTemplate = document.querySelector("#mainHeroTemplate");
let hero, heroID;

renderHeroPage();

function renderHeroPage() {
    search.style.display = "none";
    homeBtn.firstElementChild.style.color = "black";
    while (cards.hasChildNodes()) cards.removeChild(cards.lastChild);
    //Get ID of card which was clicked from localStorage
    if (localStorage.heroID) {
        // Add Loading SnackBar
        loadSnackbar.style.opacity = "1";
        id = JSON.parse(localStorage.getItem("heroID"));
        url = baseUrl + id;
        getHero(url).then(response => {
            //Change Page Properties
            pageTitle.textContent = response.name;
            pageTitle.style.width = "67vw";
            pageTitle.style.transform = "translateX(-3.5%) skewX(-5deg)";
            //Create Hero From Template
            hero = heroTemplate.content.cloneNode(true);
            setInfo(response);
            // Add Hero to DOM
            main = document.querySelector("main");
            main.appendChild(hero);
        });
    } else {
        loadBottomSnackbar(
            "Couldn't Find Your SuperHero.. Trying Bat Signal Now ",
            "lightsalmon",
            3000
        );
    }
}

async function getHero(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function setInfo(response) {
    const mainHeroImg = hero.querySelector(".main-hero-img");
    const infoFullName = hero.querySelector(".info-full-name").lastElementChild;
    const infoIntelligence = hero.querySelector(".info-intelligence")
        .lastElementChild;
    const infoPower = hero.querySelector(".info-power").lastElementChild;
    const infoPob = hero.querySelector(".info-pob").lastElementChild;
    const infoCombat = hero.querySelector(".info-combat").lastElementChild;
    const infoPublisher = hero.querySelector(".info-publisher").lastElementChild;
    const infoFirstAppearance = hero.querySelector(".info-first-appearance")
        .lastElementChild;
    const infoDurability = hero.querySelector(".info-durability")
        .lastElementChild;
    const infoHeight = hero.querySelector(".info-height").lastElementChild;
    const infoWeight = hero.querySelector(".info-weight").lastElementChild;
    const addToFav = hero.querySelector(".hero-fav");
    heroID = response.id;

    //Check if hero is already in localStorage, show Add to Favorites if not present
    if (localStorage.heroes) {
        storedHeroes = JSON.parse(localStorage.getItem("heroes"));
        if (storedHeroes.indexOf(heroID) === -1) {
            addToFav.addEventListener("click", () => {
                addToStorage(heroID);
                addToFav.style.display = "none";
            });
        } else {
            addToFav.style.display = "none";
        }
    }

    //Set Image
    mainHeroImg.setAttribute("src", response.image.url);

    // Set Bio
    infoFullName.textContent = response.biography["full-name"] || response.name;
    infoPob.textContent = validate(response.biography["place-of-birth"]);
    infoPublisher.textContent = validate(response.biography.publisher);

    //Set Power Stats
    infoIntelligence.textContent = validate(response.powerstats.intelligence);
    infoPower.textContent = validate(response.powerstats.power);
    infoCombat.textContent = validate(response.powerstats.combat);
    infoDurability.textContent = validate(response.powerstats.durability);
    infoFirstAppearance.textContent = validate(
        response.biography["first-appearance"]
    );

    //Set Appearance
    infoHeight.textContent = validate(response.appearance.height[0]);
    infoWeight.textContent = validate(response.appearance.weight[0]);

    //Remove Loading SnackBar
    loadSnackbar.style.opacity = '0';
}

function validate(text) {
    if (!text || text === "-" || text === "- lb") return "Unknown";
    return text;
}