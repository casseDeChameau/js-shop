// * //////////////////////////////////////////////////////////////////////////////     variables
let searchType = document.querySelectorAll('.search-container div');
let searchTypeArr = Array.from(searchType);
let browser = document.querySelector('#browser');
let itemWrap = document.querySelector('.item-wrap');
let itemCount = document.querySelector('.item-count');
let pager = document.querySelector('.pager');
let baseUrl = "http://localhost:8888/04-shop/js_shop-bdd/";
let nameInput = document.querySelector('.nom input');
let priceInputsArr = Array.from(document.querySelectorAll('.prix input'));
let checkboxInputsArr = Array.from(document.querySelectorAll('.categorie input'));
let p = document.querySelector('.tq-resultat');
let cartIcon = document.querySelector('.cart-icon');
let cartPanel = document.querySelector('.cart-panel');
let cross = document.querySelector('.cross');
let buyBtn = document.querySelector('.buy-btn');
let delBtn = Array.from(document.querySelectorAll('.del-btn'));
let qtyItemBtn = document.querySelector('.cart-items input');
let cartWrap = document.querySelector('.cart-wrap');
let cart = [];
let min = 0;
let max = 1000;
const articleByPage = 5;
let xhr, monJSON, monJSONComplet, catBtnArr;


/* -----------------------------------------------------------       BUSINESS LOGIC */
// ? ------------------------------ AJAX FUNCTIONS
function ajaxFunction(t) {
    if (t.status == 200 && t.readyState == 4) {
        monJSON = JSON.parse(t.responseText); // ! ici et pour dessus, le JSON est défini
        monJSON = monJSON.result;
        if (monJSONComplet == null) {
            monJSONComplet = monJSON;
        }
        // monJSON.result.forEach(function(e) {
        //     buildItem(e);
        // });
        setPages(0);
    }
}

function callAjax(queryUrl = '') {
    let apiUrl = baseUrl + 'api.php';
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function() {
        ajaxFunction(this);
    });
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(queryUrl);
}

function setUrl(choice, arg1, arg2) {
    let queryUrl;
    switch (choice) {
        case 'name':
            queryUrl = `query=like&name=${arg1}`;
            break;
        case 'price':
            queryUrl = `query=priceRange&min=${arg1}&max=${arg2}`;
            break;
        case 'cat':
            queryUrl = `query=category&category=${arg1}`;
            break;
        default:
            alert('something wrong happened')
            break;
    }
    cleanItem(), callAjax(queryUrl);
}

// ? ------------------------------ CART FUNCTIONS
function addItem(e) {
    let itemId = Number(e.currentTarget.dataset.id);
    let indexItem = cart.findIndex(item => item.id == itemId);
    if (indexItem != -1) {
        cart[indexItem].quantity++;
    } else {
        cart.push({
            id: itemId,
            quantity: 1
        })
    }
    updateCart();
}

function updateCart() {
    // ? reset cart content
    cartWrap.innerHTML = '';
    // ? to calculate the total
    let nbrArticles = 0;
    let total = 0;
    cart.forEach((item, index) => {
        // ? create the Cart DIV
        let currentDiv = document.createElement('DIV');
        currentDiv.classList.add('cart-item');
        let itemJSONindex = monJSONComplet.findIndex(product => product.id == item.id);
        currentDiv.innerHTML =
            `
        <article>
            <p>${monJSONComplet[itemJSONindex].name}</p>
        </article>
        <span>${monJSONComplet[itemJSONindex].price}€</span>
        `

        let tempInput = document.createElement('INPUT');
        tempInput.setAttribute('type', 'number');
        tempInput.setAttribute('min', '1');
        tempInput.value = item.quantity;
        tempInput.dataset.indextoupdate = index;
        tempInput.addEventListener('input', updateQuantity);
        currentDiv.appendChild(tempInput);

        // Suppression
        let tempBtnSupprimer = document.createElement('BUTTON');
        tempBtnSupprimer.classList.add('del-btn');
        tempBtnSupprimer.textContent = 'X';
        tempBtnSupprimer.dataset.indextodelete = index;
        tempBtnSupprimer.addEventListener('click', removeFromCart);
        currentDiv.appendChild(tempBtnSupprimer);
        cartWrap.appendChild(currentDiv);

        total += monJSONComplet[itemJSONindex].price * item.quantity;

        nbrArticles += item.quantity;
        if (nbrArticles > 0) {
            itemCount.innerHTML = nbrArticles;
            itemCount.style.display = 'flex';
            itemCount.style.animation = 'bounceIn';
            itemCount.style.animationDuration = '.5s';
            itemCount.addEventListener('animationend', () => {
                itemCount.style.animation = 'none'
            });
        }
    });
    let tempP = document.createElement('P');
    tempP.classList.add('total');
    tempP.textContent = 'Total : ' + total.toFixed(2) + '€';

    cartWrap.appendChild(tempP);
}

function removeFromCart(event) {
    let indexToRemove = Number(event.currentTarget.dataset.indexasupprimer);
    cart.splice(indexToRemove, 1);
    updateCart();
}

function updateQuantity(event) {
    let indexToUpdate = Number(event.currentTarget.dataset.indextoupdate);
    cart[indexToUpdate].quantity = event.currentTarget.value;
    updateCart();
}


// todo 1. Button Confirm --> call ajax vers ogone/back/login
// // todo 2. pager et cart-icon en bar top fixe
// // todo 3. update carticon number 
// // todo 4. effets d'animation sur boutons (shadow-hover, // bouncing-click)
// // todo 5. redirection page cat en click sur cat articles


/*  --------------------------------------------------------         PRESENTATION LOGIC */
// ?------------------------------- RESEARCH DIV
function nameSearch() {
    if (event.keyCode == 13) {
        setUrl('name', String(nameInput.value));
        p.innerHTML = ' Résultats pour : ' + String(nameInput.value);
        nameInput.value = '';
        nameInput.blur();
    }
}

function priceSearch(e) {
    console.log(e.target.name, e.target.value);
    if (e.target.name == 'price-min') {
        min = e.target.value;
        let label = document.querySelector('.prix [for="price-min"]');
        label.textContent = min + ' €';
    }
    if (e.target.name == 'price-max') {
        max = e.target.value;
        let label = document.querySelector('.prix [for="price-max"]');
        label.textContent = max + ' €';
    }
    if (min < max && (min != null || max != null)) {
        setUrl('price', min, max);
    }
}

function catSearch(e) {
    if (e.type == 'change') {
        if (e.target.checked) {
            console.log('je suis la');
            setUrl('cat', e.target.value);
        }
    } else if (e.type == 'submit') {
        console.log('hello', e.innerText);
        setUrl('cat', e.innerText);

    }
}

function searchChoice() {
    searchTypeArr.forEach((typeDiv) => {
        if (typeDiv.classList.contains(browser.value)) {
            typeDiv.style.display = 'flex';
        } else {
            typeDiv.style.display = 'none';
            if (browser.value == "") {
                cleanItem(), callAjax();
            }
        }
    });
}
// ?------------------------------- ITEMS DIV
function initItems() {
    callAjax();
}

function cleanItem() {
    itemWrap.innerHTML = '';
    pager.innerHTML = '';

}

function buildItem(i) {
    let div = document.createElement('div');
    div.innerHTML =
        `<div class="item" id="item${i.id}">
            <div class="item-pic">
                <img class="item-img" src="${baseUrl}assets/${i.id}.jpg" alt="img">
            </div>
            <div class="item-text">
                <h4 class="item-name">${i.name}</h4>
                <p class="item-desc">${i.description}</p>
                <button class="item-cat">${i.category}</button>
            </div>
            <div class="item-details">
                <p class="item-price">${i.price}€</p>
                <button class="add-item-btn">Add to cart</button>
            </div>
        </div>`;
    itemWrap.appendChild(div);
    let addItemBtn = document.querySelector(`#item${i.id} .add-item-btn`);
    addItemBtn.dataset.id = i.id;
    addItemBtn.addEventListener('click', addItem);
}

function buildBtn(btnNbr) {
    let pageQty = Math.ceil(monJSON.length / articleByPage);
    // affiche le pager
    for (let i = 0; i < pageQty; i++) {
        let pageBtn = document.createElement('BUTTON');
        pageBtn.classList.add('page-btn');
        pageBtn.textContent = i + 1;
        pageBtn.dataset.offset = i;

        if (pageBtn.dataset.offset == btnNbr) {
            pageBtn.style.backgroundColor = 'black';
            pageBtn.style.color = 'yellow';
        }
        pageBtn.addEventListener('click', (e) => {
            setPages(i);
        });
        pager.appendChild(pageBtn);
    }
}

function setCatResearch() {
    catBtnArr = Array.from(document.querySelectorAll('.item-cat'));
    catBtnArr.forEach((e) => {
        e.addEventListener('click', () => {
            catSearch(e);
        })
    })
}

function setPages(btnNbr = monJSON.length) {
    cleanItem();
    buildBtn(btnNbr);
    let start = btnNbr * articleByPage;
    let end = start + articleByPage > monJSON.length ? monJSON.length : start + articleByPage;
    // affiche les articles
    for (let i = start; i < end; i++) {
        buildItem(monJSON[i]);
    }
    setCatResearch()
}

// ?------------------------------- CART DIV
function toggleCartPanel() {
    cartPanel.classList.toggle('show');
    cartIcon.classList.toggle('hide');
}


// * /////////////////////////////////////////////////////////////////////////      applications
// ? researche selection and configuration
browser.addEventListener('change', searchChoice); /* choix de la façon de chercher */
nameInput.addEventListener('keyup', nameSearch); /* recherche par nom */
priceInputsArr.forEach((e) => {
    e.addEventListener('input', (e) => {
        priceSearch(e);
    })
}); /* recherche par prix */
checkboxInputsArr.forEach((e) => {
    e.addEventListener('change', (e) => {
        catSearch(e);
    })
}); /* recherche par cat */
// ? open/close cart panel
cartIcon.addEventListener('click', toggleCartPanel);
cross.addEventListener('click', toggleCartPanel);
// ? buying
buyBtn.addEventListener('click', () => {
    alert('Vous avez bien tout acheté ça arrive mardi ;P');
    location.reload();
})