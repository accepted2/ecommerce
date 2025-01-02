let cart;
const cartStatus = document.getElementById('cart-status');
cartStatus.innerHTML = ``;

// Инициализация корзины из localStorage
if (localStorage.getItem('cart') == null) {
    cart = {};
} else {
    cart = JSON.parse(localStorage.getItem('cart'));
}

// Обновление количества товаров в корзине
function updateCartQuantity() {
    const quantity = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
    localStorage.setItem('quantity', JSON.stringify(quantity));
    cartStatus.innerHTML = `(${quantity})`;
    DisplayCart(cart)
}

// Добавление товаров в корзину
const buttons = document.querySelectorAll(".btn.atc.btn-outline-success");
buttons.forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        const itemName = this.getAttribute(
            'data-product-name'); // добавьте атрибут data-product-name на кнопке
        const itemPrice = this.getAttribute(
            'data-product-price'); // добавьте атрибут data-product-price на кнопке
        const itemImage = this.getAttribute(
            'data-product-image'); // добавьте атрибут data-product-image на кнопке
        const itemDescription = this.getAttribute('data-product-description');

        if (cart[productId] != undefined) {
            cart[productId] += 1;
        } else {
            cart[productId] = 1;
            // Сохранение информации о товаре в localStorage
            localStorage.setItem(`itemName${productId}`, itemName);
            localStorage.setItem(`itemPrice${productId}`, itemPrice);
            localStorage.setItem(`itemImage${productId}`, itemImage);
            localStorage.setItem(`itemDescription${productId}`, itemDescription);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartQuantity();
    });
});

// Обновление количества при загрузке страницы
window.onload = function () {
    updateCartQuantity();
}

// Инициализация поповера
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
const popoverElement = document.getElementById('popup-id');
const checkoutUrl = popoverElement.getAttribute('data-checkout-url');

DisplayCart(cart);

function DisplayCart(cart) {
    let cartDisplay = `<div style="width: 200px; font-size: 0.75rem;">`;

    for (let productId in cart) {
        const itemName = localStorage.getItem(`itemName${productId}`) || 'Unknown Item';
        const itemPrice = localStorage.getItem(`itemPrice${productId}`) || 'Price not found';
        const itemImage = localStorage.getItem(`itemImage${productId}`) || 'default-image.jpg';

        cartDisplay += `
            <div style="display: flex; align-items: center; border-bottom: 1px solid #ddd; padding: 5px;">
                <img src="${itemImage}" alt="${itemName}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 5px;">
                <div class='cart-items' style="font-size: 0.75rem;">
                    <h6 style="margin: 0; font-size: 0.8rem;">${itemName}</h6>
                    <p style="margin: 0;">Цена: ${itemPrice}</p>
                    <h6 style="margin: 0;">Кол-во: ${cart[productId]}</h6>
                </div>
            </div>
        `;
    }

    if (Object.keys(cart).length === 0) {
        cartDisplay = `<p>Your cart is empty</p>`;
    }
    cartDisplay += `</div>`;

    popoverElement.setAttribute('data-bs-content', cartDisplay);
    popoverElement.setAttribute('data-bs-title',
        `<a id="checkout-button" class='nav-link' href="${checkoutUrl}">Checkout</a>`);

    // Уничтожаем старый поповер и создаем новый с обновленным содержимым
    const currentPopover = popoverList.find(popover => popover._element === popoverElement);
    if (currentPopover) {
        currentPopover.dispose();
    }
    new bootstrap.Popover(popoverElement, { content: cartDisplay, html: true });
}


let cart_items;
const cartItemsContainer = document.getElementById('list-group');

// Инициализация корзины из localStorage
if (localStorage.getItem('cart') == null) {
    cart_items = {};
} else {
    cart_items = JSON.parse(localStorage.getItem('cart'));
}
let totalQuantity = 0;

function displayCheckoutCart(cart_items) {
    let cartDisplay = '';

    for (let productId in cart_items) {
        const itemName = localStorage.getItem(`itemName${productId}`) || 'Unknown Item';
        const itemPrice = localStorage.getItem(`itemPrice${productId}`) || 'Price not found';
        const itemImage = localStorage.getItem(`itemImage${productId}`) || 'default-image.jpg';
        const itemDescription = localStorage.getItem(`itemDescription${productId}`) || 'Описание отсутствует';
        // Сохраняем описание
        const quantity = cart_items[productId];
        const shortDescription = itemDescription.length > 50 ? itemDescription.substring(0, 50) + '...' :
            itemDescription;

        totalQuantity += parseFloat(itemPrice * quantity)

        cartDisplay += `
            <li class="list-group-item d-flex justify-content-between align-items-start" style='padding:10px; '>
                <img src="${itemImage}" alt="${itemName}" style="width: 50px; height: 50px; object-fit: contain; margin-right: 10px;">
                <div class="ms-2 me-auto" style="flex-grow: 1;">
                    <div class="fw-bold">${itemName}</div>
                    <p id='qualities' >Кол-во: ${quantity}</p>
                    <p>Кол-во: ${itemPrice}</p>
                    <p id='description' class="description">${shortDescription} <span class="read-more" style="color: blue; cursor: pointer;">(показать больше)</span></p>
                    <p class="full-description" style="display: none;">${itemDescription}</p>
                   
                </div>
                <p id='total' >Total:    </p>
               <span  class="badge text-bg-primary rounded-pill"> ${itemPrice * quantity}$</span>
            </li>
            <hr>
            
        `;

    }

    if (Object.keys(cart).length === 0) {
        cartDisplay = `<p>Ваша корзина пуста</p>`;
    }

    cartDisplay += `<div style="text-align: right; ">
    <span  style="color: green; font-size: 1.1rem; margin-top:4px;">Total: ${totalQuantity}$</span>
    <hr style="width: 8%; margin-left: auto; margin-right: 0; margin-top: 5px;">
</div>`
    document.getElementById("totalQuantity").value = totalQuantity;



    cartItemsContainer.innerHTML = cartDisplay;

    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function () {
            const fullDescription = this.parentElement
                .nextElementSibling; // Находим полный текст описания
            fullDescription.style.display = fullDescription.style.display === 'none' ? 'block' : 'none';
            this.textContent = this.textContent === '(показать больше)' ? '(скрыть)' :
                '(показать больше)';
        });
    });

}
displayCheckoutCart(cart_items)
document.getElementById("checkout-form").addEventListener("submit", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    document.getElementById("items").value = JSON.stringify(cart);
});

// Вызываем функцию отображения корзины при загрузке страницы