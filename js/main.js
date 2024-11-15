
var products = {
    0: {
        name : "DMG Backlight Kit",
        pic : "DMGbl0.webp",
        price : 10.99
    },
    1: {
        name : "GBA Laminated IPS Screen",
        pic : "GBAips.webp",
        price : 58.99
    },
    2: {
        name : "GBA Shell for laminated screens",
        pic : "GBApinkshell.webp",
        price : 11.99
    },
    3: {
        name : "GBA USB-C battery modkit",
        pic : "GBAusbc.webp",
        price : 30.99
    },
    4: {
        name : "Set of DMG buttons",
        pic : "DMGbuttons.webp",
        price : 5.99
    },
    5: {
        name : "DMG button membranes",
        pic : "DMGmembranes.webp",
        price : 2.99
    },
    6: {
        name : "GBP USB-C battery modkit",
        pic : "GBPusbc.webp",
        price : 26.99
    },
    7: {
        name : "GBP volume wheel replacement",
        pic : "GBPwheel.webp",
        price : 3.99
    },
    8: {
        name : "NS Animal Crossing backplate",
        pic : "NSbackplate.webp",
        price : 21.99
    },
    9: {
        name : "NS Joy-Con replacement sticks",
        pic : "NSstick.webp",
        price : 4.99
    },
    10: {
        name : "GBA custom motherboard",
        pic : "GBApcb.webp",
        price : 59.99
    },
    11: {
        name : "GBA station dock USB-C",
        pic : "GBAdock.webp",
        price : 34.99
    }
};
  
var cart = {
    // properties/attributen van cart
    htmlProductsList : null,      // producten lijst html
    htmlItemsInCart : null,    // html current cart
    items : {},       // current items in cart
    imagesURL : "img/mods/", // product image url folder
    total : 0,        // total amount
  
    // LocalStorage cart dingen
    save : () => localStorage.setItem("cart", JSON.stringify(cart.items)),
    // dit slaat de huidige cart op naar de LocalStorage
  
    load : () => {
        cart.items = localStorage.getItem("cart"); // pak LS cart naar cart.items object
        if (cart.items == null) { cart.items = {}; } // als leeg
        else { cart.items = JSON.parse(cart.items); } // string naar JSON
    }, 
  
    empty : () => { 
        if (confirm("Empty cart?")) { // als pop-up message Ja
            cart.items = {}; // cart.items object weer leeg
            localStorage.removeItem("cart"); // LS cart weghalen
            cart.list(); // roept list functie aan
        }
    },
  
    // cart initializeren dingen, deze functie wordt aangeroepen
    init : () => {
        cart.htmlProductsList = document.getElementById("all-stuff"); // producten lijst html getten
        cart.htmlItemsInCart = document.getElementById("cart-inventory"); // producten in cart html getten
  
      // producten lijst maken:
        cart.htmlProductsList.innerHTML = "";
        let template = document.getElementById("mod-template").content, p, item; // template van een mod pakken
        for (let id in products) { 
            p = products[id];
            item = template.cloneNode(true); // clone het template inclu sub-elementen (subtree)
            item.querySelector(".mod-image").src = cart.imagesURL + p.pic; // zet src van image naar img url + image wat in products object staat
            item.querySelector(".mod-name").textContent = p.name; // zet de text van .mod-name naar de product naam
            item.querySelector(".mod-price").textContent = "€" + p.price.toFixed(2); // zet prijs naar eur+ price met twee kommagetallen
            item.querySelector(".mod-add").onclick = () => cart.add(id); // click event om product ID toe te voegen aan cart
            cart.htmlProductsList.appendChild(item); // en het product toevoegen aan de productlijst
        }
  
        cart.load(); //roept load aan, dus de LS cart gelijk aan cart object
        cart.list(); // lijst de producten in cart (zie onder)
    },
  
    // list laat de producten in de cart zien in de html
    list : () => {
        // eerst resetten
        cart.total = 0;
        cart.htmlItemsInCart.innerHTML = "";
        let item, empty = true;
        for (let key in cart.items) { // key is een product in cart
            if (cart.items.hasOwnProperty(key)) { //als de items key als property heeft, oftewel als items niet leeg is
                empty = false; 
                break; 
            }
        }
  
        if (empty) { // als de cart empty is
            item = document.createElement("section");
            item.classList.add('cart-item'); // dit is stiekem voor styling
            item.innerHTML = "Your cart is empty.";
            cart.htmlItemsInCart.appendChild(item); //voeg het item met de Empty text toe waar normaal de inventory staat
        } else { // als er producten in cart liggen
        let template = document.getElementById("cart-template").content, p;
            for (let id in cart.items) {
                p = products[id];
                item = template.cloneNode(true); // template kopieren
                item.querySelector(".cart-delete").onclick = () => cart.remove(id); // delete knop
                item.querySelector(".cart-name").textContent = p.name; // naam
                item.querySelector(".cart-quantity").value = cart.items[id]; // aantal is hoeveel van dezelfde id in cart.items zit
                item.querySelector(".cart-quantity").onchange = function () { 
                    // wanneer cart-quantity verandert, change aanroepen met huidige id en waarde
                    cart.change(id, this.value); 
                };
                cart.htmlItemsInCart.appendChild(item); // voeg de html van dit item toe
                cart.total += cart.items[id] * p.price; //total is hoeveel producten keer de productprijs
            }
            // totale prijs html toevoegen
            item = document.createElement("section");
            item.className = "cart-total";
            item.id = "cart-total";
            item.innerHTML = `Total: €${cart.total}`;
            cart.htmlItemsInCart.appendChild(item);
  
            // cart-checkout-template bevat de knoppen voor de empty functie en de checkout functie
            item = document.getElementById("cart-checkout-template").content.cloneNode(true);
            cart.htmlItemsInCart.appendChild(item);
        }
    },
  
    // product toevoegen
    add : id => {
        if (cart.items[id] == undefined) { //als er geen van dit product al in cart zat
            cart.items[id] = 1; // maak het aantal van dit product 1
        } else { 
            cart.items[id]++; // en anders tel er 1 bij op
        }
        cart.save(); // save naar LS
        cart.list(); // lijst opnieuw de producten in de cart, zodat de nieuwe waarden erin staan
    },
  
    // quantiteit veranderen
    change : (productId, quantity) => { // product id en quantiteit
        // als de quantiteit 0 is wordt het product verwijderd
        if (quantity <= 0) {
            delete cart.items[productId];
            cart.save(); 
            cart.list();
        } else { // anders wordt alleen de quantiteit aangepast
            cart.items[productId] = quantity;
            cart.total = 0;
            for (let id in cart.items) {
                cart.total += cart.items[id] * products[id].price; // prijsberekening
                document.getElementById("cart-total").innerHTML = `Total: €${cart.total}`; //update de html
            }
        }
    },
    // product weghalen
    remove : id => {
        delete cart.items[id];
        cart.save();
        cart.list();
    },
  
    // checkout knop
    checkout : () => {
        alert("Really? Trusting a college student with your money?");
    }
};
window.addEventListener("DOMContentLoaded", cart.init);