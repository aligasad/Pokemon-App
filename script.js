const typeURL = "https://pokeapi.co/api/v2/type/?limit=21"; // we use ?limit=21 because we need all 21 options
const select = document.querySelector('select');
const pokemon = document.querySelector('#pokemons');
const search = document.querySelector('#search');
const loadMore = document.querySelector('#loadMore');
const loading = document.querySelector('#loading');
const reset = document.querySelector("#reset");


let offset = 0;
let limit = 20;
const pokemonURL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let types;
let pokemons;
let finalData;
console.log(finalData);
getType();
getPokemons(pokemonURL);

console.log(finalData);

reset.addEventListener('click', ()=>{
  pokemon.innerHTML = "";
  const data = getPokemons(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=0`);
  displayPokemons(data);
  
})

loadMore.addEventListener('click', (e)=>{
  search.value = "";
  offset = offset + limit;
  getPokemons(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
})

// SEARCHING WITHOUT DEBPUNDING-----------------------------------------------------
// search.addEventListener('keyup', (e)=>{
//   if(e.target.value.length === 0) displayPokemons(finalData);
//   const searchPokemons = finalData.filter((obj)=>{
//     return obj.name.includes(e.target.value);
//   });

//   if(searchPokemons.length === 0){
//     pokemon.innerHTML = "";
//     pokemon.innerHTML = "<h1>No Pokemons are Found</h1>"
//   }
//   else{
//     pokemon.innerHTML = "";
//     displayPokemons(searchPokemons);
//   }
  
// })

// SEARCHING WITH DEBPUNDING-----------------------------------------------------
function debounce(func, delay){
  let timer;
  return function (...args){
    clearInterval(timer);
    timer = setTimeout(()=> func(...args), delay);
  }
}
function searchQuery(e) {
  if(e.target.value.length === 0) displayPokemons(finalData);
  const searchPokemons = finalData.filter((obj)=>{
    return obj.name.includes(e.target.value);
  });

  if(searchPokemons.length === 0){
    pokemon.innerHTML = "";
    pokemon.innerHTML = "<h1>No Pokemons are Found</h1>"
  }
  else{
    pokemon.innerHTML = "";
    displayPokemons(searchPokemons);
  }
}
const debouncFunc = debounce(searchQuery, 1200);
search.addEventListener('keyup', debouncFunc);
// ------------END DEBOUNCING------------------------------------------------
select.addEventListener('change', (e)=>{
  // console.log(e.target.value);
  const copy = finalData;
  if(e.target.value === "all"){
    displayPokemons(finalData);
  }
  else{
    pokemon.innerHTML = "";
    displayPokemons(
      copy.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === e.target.value)
      )
    );
  }
  
});

async function getPokemons(url){
  pokemons = await getDataFromURL(url);
  pokemons = pokemons.results;

  // 2nd Method---- ---- ---       ----              ------
  // EK SAATH SAARE PROMISES SHOW KRA RHE HAI
  const promises = [];
  pokemons.forEach(async (obj)=>{
    promises.push(getDataFromURL(obj.url));
    
  });
  finalData = await Promise.all(promises);

  console.log(finalData);
  displayPokemons(finalData);
}

// displaying with card----------------------------------
function displayPokemons(pokemons){
  loading.style.display = 'block';
  const fragment = document.createDocumentFragment();
  pokemons.forEach((obj)=>{

    const flipCard = document.createElement('div');
    flipCard.className = "flip-card";
    const flipCardInner = document.createElement('div');
    flipCardInner.className = "flip-card-inner";
    
    const flipCardFront = document.createElement('div');
    flipCardFront.className = "flip-card-front";
    const pokeImg = document.createElement('img');
    pokeImg.src = obj.sprites.other.dream_world.front_default;

    const pokeName = document.createElement('h3');
    pokeName.innerText = obj.name;
    console.log(pokeName);

    const pokeId = document.createElement('p');
    pokeId.innerHTML = `<strong>Id: </strong> ${obj.id} <br>`;
    pokeId.className = "pokeId";
    let pokeType = document.createElement('p');
    const types = [];
    obj.types.forEach((typeObj)=>{
      types.push(typeObj.type.name);
    });

    flipCardFront.id = types[0];
    pokeType.innerHTML = "<strong>Type: </strong>" + types.toString();
    const flipCardBack = document.createElement('div');

    const heading = document.createElement('h4');
    heading.innerText = "@wanderlust_026"

    const backImg = document.createElement('img');
    backImg.src = obj.sprites.other.dream_world.front_default;
    backImg.className = "backImg";

    flipCardBack.className = "flip-card-back";
    const backName = document.createElement('p');
    backName.innerHTML = `<strong>Name:</strong> ${obj.name} <br>  <strong>Height: </strong> ${obj.height} <br> <strong>Weight: </strong> ${obj.weight} <br> <strong>Moves: </strong> ${obj.moves[0].move.name} <br>  <strong>Rank: </strong> ${obj.base_experience} <br> <strong>Abilitirs: </strong> ${obj.abilities[0].ability.name} <br>`
    backName.classList.add("detailsBack");

    const backId = document.createElement('p');
    backId.className = "pokeIdBack";
    backId.innerHTML = `<strong>Id: </strong> ${obj.id} <br>`;

    const content = document.createElement('div');
    content.append(pokeName, pokeType)

    flipCardFront.append(pokeId, pokeImg, content);
    flipCardBack.append(backId, heading,  backName, backImg);
    flipCardInner.append(flipCardFront, flipCardBack);
    flipCard.append(flipCardInner);
    fragment.append(flipCard);
  });
  // pokemon.innerHTML = "";
  loading.style.display = 'none';
  pokemon.append(fragment);
} 

// displaying without card----------------------------------
// function displayPokemons(pokemons){
//   loading.style.display = 'block';
//   const fragment = document.createDocumentFragment();
//   pokemons.forEach((obj)=>{
//     const pokeDiv = document.createElement('div');
//     pokeDiv.className = "imgDiv";

//     const pokeImg = document.createElement('img');
//     pokeImg.className = "pokeImg";
//     pokeImg.src = obj.sprites.other.dream_world.front_default;

//     const pokeName = document.createElement('h3');
//     pokeName.innerText = obj.name;
    
//     let pokeType = document.createElement('p');

//     const types = [];
//     obj.types.forEach((typeObj)=>{
//       types.push(typeObj.type.name);
//     });
//     pokeType.innerHTML = "<strong>Type: </strong>" + types.toString();

//     pokeDiv.append(pokeImg,  pokeName, pokeType);
//     fragment.append(pokeDiv);
//   });
//   // pokemon.innerHTML = "";
//   loading.style.display = 'none';
//   pokemon.append(fragment);
// } 

async function getType() {
  types = await getDataFromURL(typeURL);
  types = types.results;
  createOptions(types);
}

function createOptions(types) {
  const fragment = document.createDocumentFragment();
  types.forEach((obj)=>{
    const option = document.createElement('option');
    option.value = obj.name;
    option.innerText = obj.name;
    fragment.append(option);
  });
  select.append(fragment);
}

// FOR FETCHING DATA FROM BROWSER--- - -  -   -    -     -     -
async function getDataFromURL(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}