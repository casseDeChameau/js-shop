let section = document.querySelector('.row');
let ajax = new XMLHttpRequest();

ajax.addEventListener('readystatechange', function(e) {
    if (this.status == 200 && this.readyState == 4) {
        let json = JSON.parse(this.responseText);

        let monJSON = json.result; // lisibilité

        for (let i = 0; i < monJSON.length; i++) {
            let monDiv = document.createElement('DIV');
            monDiv.classList.add("card");
            monDiv.setAttribute('data-cat', monJSON[i].category)

            monDiv.innerHTML = `
            <img src="img/${monJSON[i].id}.jpg" class="card-img-top pt-2">
            <span class="card-body" >
            <h4 class="card-title">${monJSON[i].name}</h4>
            <h5 class="text-primary"> Category: ${monJSON[i].category} </h5>
            <p class="card-text"> ${monJSON[i].description}</p>
            </span>

            <h4 class="card-text fw-bold mx-auto"> Price: ${monJSON[i].price} €</h4>
            <button class="btn btn-primary prix" data-id="${monJSON[i].id}">Add to Cart</button>
            `;

            section.appendChild(monDiv);



        }
    }
})

ajax.open("POST", "js/api.php", true);
ajax.send();



let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let right = section.getBoundingClientRect().right;
let left = section.getBoundingClientRect().left;
console.log(right)
console.log(left)
let pas = -40;
next.addEventListener('click', function() {
    let positionright = section.getBoundingClientRect().right;
    console.log(positionright)
    if (positionright < -350) {
        next.disabled = true;
        previous.disabled = false;
    } else {
        pas = pas - 400
        section.style.transform = "translateX(" + pas + "px)";
        previous.disabled = false;

    }

})

previous.addEventListener('click', function() {
    let positionleft = section.getBoundingClientRect().left;
    console.log(positionleft)
    if (positionleft > left) {
        previous.disabled = true;
        next.disabled = false;
    } else {
        pas = pas + 400
        section.style.transform = "translateX(" + pas + "px)";
        next.disabled = false;
    }

})

// //pagination

// let monblockArticles = document.querySelector('.filtrage');

// let ajax = new XMLHttpRequest();
// ajax.addEventListener('readystatechange', function (e) {
//     if (this.status == 200 && this.readyState == 4) {


//         function effacer(node) {
//             while (node.children.length > 0) {
//                 node.removeChild(node.children[0]);
//             }
//         }


//         function updateHTML(event) {
//             let offset = Number(event.currentTarget.dataset.offset);
//             afficheArticle(offset);
//         }
//         let json = JSON.parse(this.responseText);

//         let monJSON = json.result; // lisibilité

//         function afficheArticle(offset) {
//             effacer(monblockArticles);

//             const articleParPage = 4;
//             let nombreDePages = Math.ceil(monJSON.length / articleParPage);

//             let start = offset * articleParPage;
//             let end = (start + articleParPage > monJSON.length) ? monJSON.length : start + articleParPage;

//                 for (let i = start; i < end; i++) {
//                     let monDiv = document.createElement('DIV');
//                     monDiv.classList.add("card");
//                     monDiv.setAttribute('data-cat', monJSON[i].category)

//                     monDiv.innerHTML = `
//                         <img src="img/${monJSON[i].id}.jpg" class="card-img-top pt-2">
//                         <span class="card-body" >
//                         <h4 class="card-title">${monJSON[i].name}</h4>
//                         <h5 class="text-primary"> Category: ${monJSON[i].category} </h5>
//                         <p class="card-text"> ${monJSON[i].description}</p>
//                         </span>
//                         <h4 class="card-text fw-bold mx-auto"> Price: ${monJSON[i].price} €</h4>
//                         <button class="btn btn-primary prix" data-id="${monJSON[i].id}">Add to Cart</button>
//                         `;

//                     section.appendChild(monDiv);

//                 }

//                 let monDivPagination = document.createElement('DIV');
//                 monblockArticles.appendChild(monDivPagination);
//                 monDivPagination.classList.add ('pagination');

//             // affiche le pager
//             for (let i = 0; i < nombreDePages; i++) {

//                 let monBouton = document.createElement('BUTTON');
//                 monBouton.textContent = i + 1;
//                 monBouton.dataset.offset = i;

//                 if (offset == i) {
//                     monBouton.disabled = true;
//                 }
//                 monBouton.addEventListener('click', updateHTML)
//                 monDivPagination.appendChild(monBouton);
//             }
//         }
//         afficheArticle(0);
//     }
// })

// ajax.open("POST", "js/api.php", true);
// ajax.send();


window.addEventListener('load', function() {

    // sort by category

    let boutons = document.querySelectorAll('.categ'); // On catch tous les boutons
    boutons.forEach(bouton => { // Pour chacun d'eux ...
        bouton.addEventListener('click', function() { // On écoute le click
            let boutonSelected = bouton.getAttribute('data-cat'); // On catch le data-filter du bouton en question

            let articleToHide = document.querySelectorAll(`.filtrage div:not([data-cat='${boutonSelected}'])`); // On catch les éléments à cacher
            let articleToShow = document.querySelectorAll(`.filtrage [data-cat='${boutonSelected}']`); // On catch les éléments à montrer

            // On check si "all" a été clické, si oui on affiche tout
            if (boutonSelected == 'all') {
                articleToHide = [];
                articleToShow = document.querySelectorAll('.filtrage [data-cat]');
            }
            // Pour chaque élément capturé dans articleToHide, on met la classe hide et on enlève la classe show
            articleToHide.forEach(el => {
                el.classList.add('off');
                el.classList.remove('on');
            });
            // Pour chaque élément capturé dans articleToShow, on met la classe show et on enlève la classe hide
            articleToShow.forEach(el => {
                el.classList.remove('off');
                el.classList.add('on');
            });
        });
    });


    // Search

    let btnSearch = document.querySelector('button.search');
    let inputSearch = document.querySelector('input.search');
    let titleArticle = document.querySelectorAll('.card-title');
    let articles = document.querySelectorAll('.card');

    btnSearch.addEventListener('click', function() {

        let inputSearchValue = inputSearch.value;

        for (let i = 0; i < titleArticle.length; i++) {

            let titleArticleText = (titleArticle[i].textContent).toLowerCase();

            function find(haystack, needle) {
                return haystack.indexOf(needle) != -1;
            }
            let reponse = find(titleArticleText, inputSearchValue);
            console.log(reponse); //true-false

            if (reponse === true) {
                articles[i].classList.add('on');
                articles[i].classList.remove('off');;
            } else {
                articles[i].classList.add('off');
                articles[i].classList.remove('on');;
            }
        }




    })

    //Range
    function supp(nodeHTML) {
        while (nodeHTML.children.length > 0) {
            nodeHTML.removeChild(nodeHTML.children[0]);
        }
    }

    function reload() {
        location.reload(true);
    }
    let reset = document.querySelector('.reset');
    reset.addEventListener('click', function() {
        reload();
    });

    const URLAPI = 'http://localhost:8888/js_shop-bdd/api.php';
    let xhr = new XMLHttpRequest();
    let dataJson;

    let monblockArticles = document.querySelector('.filtrage');
    let maSubmitRange = document.querySelector('.submit-range');
    let selectionMin = document.querySelector('.rangemin');
    let selectionMax = document.querySelector('.rangemax');

    maSubmitRange.addEventListener('click', function(e) {


        xhr.addEventListener('readystatechange', function(e) {
            if (this.readyState == 4 && this.status == 200) {
                dataJson = JSON.parse(this.responseText);
                supp(monblockArticles);

                let monJSON = dataJson.result;

                for (let i = 0; i < monJSON.length; i++) {
                    let monDiv = document.createElement('DIV');
                    monDiv.classList.add("card");
                    monDiv.setAttribute('data-cat', monJSON[i].category)

                    monDiv.innerHTML = `
                    <img src="img/${monJSON[i].id}.jpg" class="card-img-top pt-2">
                    <span class="card-body" >
                    <h4 class="card-title">${monJSON[i].name}</h4>
                    <h5 class="text-primary"> Category: ${monJSON[i].category} </h5>
                    <p class="card-text"> ${monJSON[i].description}</p>
                    </span>
                    
                    <h4 class="card-text fw-bold mx-auto"> Price: ${monJSON[i].price} €</h4>
                    <button class="btn btn-primary prix" data-id="${monJSON[i].id}">Add to Cart</button>
                    `;

                    section.appendChild(monDiv);

                }
            }
        })


        var params = new FormData(); // <form></form>

        params.append('query', 'priceRange');
        params.append('priceRange', 'min');
        params.append('min', selectionMin.value);
        params.append('max', selectionMax.value);

        xhr.open('POST', URLAPI, true);
        xhr.send(params);

    })

    // Add to Cart


    let addBtn = document.querySelectorAll('.prix');
    let notification = document.querySelector(".notification");
    let nbrArticle = 0;

    let ajax3 = new XMLHttpRequest();

    ajax3.addEventListener('readystatechange', function(e) {
        if (this.status == 200 && this.readyState == 4) {
            let monJson = JSON.parse(this.responseText);

            function mettreAJourQuantite(event) {
                let indexAModifier = Number(event.currentTarget.dataset.indexamodifier);

                panier[indexAModifier].quantity = event.currentTarget.value;
                //console.log(panier)
                afficherPanier();
            }

            function supprimerDuPanier(event) {
                let indexASupprimer = Number(event.currentTarget.dataset.indexasupprimer);
                let nbrASupprimerNotif = panier[indexASupprimer].quantity;
                panier.splice(indexASupprimer, 1);

                afficherPanier();

                //Notification
                nbrArticle = nbrArticle - nbrASupprimerNotif;

                notification.classList.add('show-notif');
                notification.textContent = nbrArticle;
            }

            function mettreAJourNotif(event) {
                if (nbrArticle == 0) {
                    notification.classList.remove('show-notif');
                }

            }

            function afficherPanier() {


                divPanier.innerHTML = ``;

                let prixTotal = 0;


                panier.forEach((item, index) => {
                    // Li container
                    let tempLi = document.createElement('LI');
                    tempLi.classList.add('li');

                    let indexAchat = monJson.result.findIndex(produit => produit.id == item.id);

                    tempLi.innerHTML = `
                            
            <a class="dropdown-item" href="#" >
            <span class="mx-3" class="produit-ajouter">${item.quantity}</span>
            ${monJson.result[indexAchat].name}
            <span class="mx-3">${monJson.result[indexAchat].price}€</span>
            </a>
            `;
                    divPanier.appendChild(tempLi);

                    // Quantité
                    let tempInput = document.createElement('DIV');
                    tempInput.setAttribute('type', 'number');
                    tempInput.setAttribute('min', '1');
                    tempInput.textContent = item.quantity;
                    tempInput.dataset.indexamodifier = index;

                    tempInput.addEventListener('input', mettreAJourQuantite);



                    // Suppression
                    let tempBtnSupprimer = document.createElement('BUTTON');
                    tempBtnSupprimer.textContent = 'X';
                    tempBtnSupprimer.classList.add('btn-primary');
                    tempBtnSupprimer.dataset.indexasupprimer = index;

                    tempBtnSupprimer.addEventListener('click', supprimerDuPanier);
                    tempBtnSupprimer.addEventListener('click', mettreAJourNotif);

                    tempLi.appendChild(tempBtnSupprimer);

                    prixTotal += monJson.result[indexAchat].price * item.quantity;

                })


                // ToDo Button Confirm --> call ajax vers ogone/back/login
                let tempLi = document.createElement('LI');
                tempLi.classList.add('prix');

                tempLi.textContent = 'Total : ' + prixTotal + '€';

                divPanier.appendChild(tempLi);
            }

            function ajouterAuPanier(event) {
                let idAchat = Number(event.currentTarget.dataset.id);
                // console.log(idAchat);

                let indexAchat = panier.findIndex(item => item.id == idAchat);

                if (indexAchat != -1) {
                    panier[indexAchat].quantity++;
                } else {
                    panier.push({
                        id: idAchat,
                        quantity: 1
                    })
                }

                console.log(panier);

                afficherPanier();

                //Notification
                nbrArticle = nbrArticle + 1;

                notification.classList.add('show-notif');
                notification.textContent = nbrArticle;
            }

            let divPanier = document.querySelector(".dropdown-menu");
            let panier = [];


            let empty = document.querySelector(".empty");
            for (let i = 0; i < addBtn.length; i++) {
                addBtn[i].addEventListener('click', ajouterAuPanier);
                addBtn[i].addEventListener('click', function() {
                    empty.classList.add('off');


                });



            }

        }

    })

    ajax3.open("POST", "js/api.php", true);
    ajax3.send();


})