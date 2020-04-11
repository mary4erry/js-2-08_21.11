const API_URL ='https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
// /catalogData.json – получить список товаров;
// /getBasket.json – получить содержимое корзины;
// /addToBasket.json – добавить товар в корзину;
// /deleteFromBasket.json – удалить товар из корзины.

// let app = new Vue ({
//     el: '#app',
//     data: {
//         //данные, формируемые/изменяемые внутри компонента
//         url: 'https://jsonplaceholder.typicode.com/comments',
//         comments: [],
//         name: 'Ivan Petrov',
//         text: 'Some text',
//         email: 'example@yandex.com',
//         firstShown: true,
//         limit: 10,
//     },
//     methods: {
//         // а ля "функции"
//         getJSON (url) {
//             return fetch (url)
//                     .then (d => d.json ())
//         },
//         toggleFirstPost () {
//             this.firstShown = !this.firstShown
//         },
//         reload () {
//             this.getJSON (this.url + `?_limit=${this.limit}`)
//                 .then (data => {this.comments = data})
//         }
//     },
//     computed: {
//         toggleBtnText () {
//             return this.firstShown ? 'Скрыть' : 'Показать'
//         }
//         // вычисляемые значения (а ля ф-ции, возвращающие рез-т)
//     },
//     // "хуки жизненного цикла" (а ля события, но касающиеся вью-компонента)
//     mounted () {
//         this.getJSON (this.url + `?_limit=${this.limit}`)
//             .then (data => {this.comments = data})
//             //.finally (() => {console.log (this.comments)})
//     },
//     created () {
//         console.log ('Я создан, но еще не появился')
//     }
// })


const image = 'https://placehold.it/200x150';
const cartImage = 'https://placehold.it/100x80';

class List {
    constructor(url, container) {
        this.container = container
        this.url = url
        this.items = []
        this.renderedItems = []
        this._init()
    }
    _init() {
        return false
    }
    getJSON (url) {
        return fetch (url)
            .then (data => data.json())
    }
    handleData(arr) {
        arr.forEach( el => {
            this.items.push(new lists [this.constructor.name] (el))
        })
    }
    _render() {
        let trg = document.querySelector(this.container);
        let str = '';
        this.items.forEach (item => {
            str += item.render()
        });
        trg.innerHTML = str;
    }
}
class Catalog extends List {
    constructor(cart, url = `${API_URL}/catalogData.json`, container = '.products') {
        super(url,container)
        this.cart = cart
    }
    _init() {
        this.getJSON(this.url)
            .then(data => this.handleData(data))
            .then(() => this._render())
    }
}
class Cart extends List {
    constructor(url = `${API_URL}/getBasket.json`, container = '.cart-block') {
        super(url,container)
    }
    _init() {
        this.getJSON(this.url)
            .then(data => this.handleData(data.contents))
            .then(() => this._render())
            .catch (err => {document.querySelector(this.container).innerText = `Ошибка загрузки данных ${err}`})
    }
    addProduct(product) {
        this.getJSON(`${API_URL}/addToBasket.json`)
            .then (data => {                
                if (data.result == 1) {
                    // console.log('get it');

                    let selectedProduct = {
                        'id_product': +product.dataset['id'],
                        'product_name': product.dataset['name'],
                        'price': +product.dataset['price'],
                        'quantity': 1
                    }
                    let find = this.items.find (element => element.id_product === selectedProduct.id_product)
                    if (!find) {
                        this.items.push(new CartItem (selectedProduct))
                    } else {
                        find.quantity++
                    }
                    this._render()
                } else {
                    alert("В процессе добавления товара возникла ошибка")
                }
            })
            .catch (err => {document.querySelector(this.container).innerText = `Ошибка загрузки данных ${err}`})
    }
    removeProduct(product) {
        this.getJSON (`${API_URL}/deleteFromBasket.json`)
            .then (data => {
                if (data.result == 1) {
                    let productId = +product.dataset['id'];
                    let find = this.items.find (element => element.id_product === productId);
                    if (find.quantity > 1) {
                        find.quantity--;
                    } else {
                        this.items.splice(this.items.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove()
                    }
                    this._render();
                } else {
                    alert("В процессе удаления товара возникла ошибка")
                }
            }) 
            .catch (err => {document.querySelector(this.container).innerText = `Ошибка обновления корзины ${err}`})
    }
}

class Item {
    constructor(product, img = image) {
        this.id_product = product.id_product
        this.product_name = product.product_name
        this.price = product.price
        this.img = img
    }
    render() {
        return `<div class="product-item" data-id="${this.id_product }">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.product_name}</h3>
                        <p>${this.price} $</p>
                        <button class="buy-btn" 
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-image="${this.img}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`
    }
}
class Product extends Item {
    constructor (product, img = image) {
        super (product, img)
    }
    render () {
        return `<div class="product-item" data-id="${this.id_product}">
                    <img src="${this.img}" alt="Some img">
                    <div class="desc">
                        <h3>${this.product_name}</h3>
                        <p>${this.price} &#x20bd; </p>
                        <button class="buy-btn" 
                        data-id="${this.id_product}"
                        data-name="${this.product_name}"
                        data-image="${this.img}"
                        data-price="${this.price}">Купить</button>
                    </div>
                </div>`
    }
}

class CartItem extends Item {
    constructor(product, img = cartImage) {
        super(product, img)
        this.quantity = product.quantity
        this.render()
    }
    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
                    <div class="product-bio">
                        <img src="${this.img}" alt="Some image">
                        <div class="product-desc">
                            <p class="product-title">${this.product_name}</p>
                            <p class="product-quantity">Quantity: ${this.quantity}</p>
                            <p class="product-single-price">$${this.price} each</p>
                        </div>
                    </div>
                    <div class="right-block">
                        <p class="product-price">${this.quantity * this.price}</p>
                        <button class="del-btn" data-id="${this.id_product}">&times;</button>
                    </div>
                </div>`
    }
}
let catalog = new Catalog()
let cart = new Cart ()

let lists = {
    //Класс списка: Класс соотв элемента списка
    Catalog: Product,
    Cart: CartItem
}

//кнопка скрытия и показа корзины
document.querySelector('.btn-cart').addEventListener('click', () => {
    document.querySelector('.cart-block').classList.toggle('invisible');
});
//кнопки удаления товара (добавляется один раз)
document.querySelector('.cart-block').addEventListener ('click', (evt) => {
    if (evt.target.classList.contains ('del-btn')) {
        cart.removeProduct (evt.target);
    }
})
//кнопки покупки товара (добавляется один раз)
document.querySelector('.products').addEventListener ('click', (evt) => {
    if (evt.target.classList.contains ('buy-btn')) {
        cart.addProduct (evt.target);
    }
})


// function fetchData (url) {
//     return new Promise ((resolve, reject) => {
//         let xhr = new XMLHttpRequest()
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4) {
//                 if (xhr.status == 200) {
//                     resolve (xhr.responseText)
//                 } else {
//                     reject (xhr.status)
//                 }
//             }
//         }
//         xhr.open('GET', url, true) 
//         xhr.send()
//     })
// }

// class Catalog {
//     constructor() {
//         this.products = []
//         this.container = '.products'
//         this._init()
//     }
//     _init() {
//         fetchData (`${API_URL}/catalogData.json`)
//             .then(dataJSON => JSON.parse(dataJSON))     
//             .then(data => {
//                 data.forEach (el => {
//                 this.products.push (new Product (el))
//                 this.render ()
//                 })
//             })
//             .catch(err => {document.querySelector(this.container).innerText = `Ошибка загрузки данных ${err}`})
//     }
//     render() {
//         let trg = document.querySelector (this.container)
//         let str = ''
//         this.products.forEach (prod => {
//             str += prod.render()
//         })
//         trg.innerHTML = str
//     }
// }
// class Product {
//     constructor(product) {
//         this.id = product.id_product
//         this.title = product.product_name
//         this.price = product.price
//         this.img = image
//     }
//     render() {
//         return `<div class="product-item" data-id="${this.id}">
//                     <img src="${this.img}" alt="Some img">
//                     <div class="desc">
//                         <h3>${this.title}</h3>
//                         <p>${this.price} $</p>
//                         <button class="buy-btn" 
//                         data-id="${this.id}"
//                         data-name="${this.title}"
//                         data-image="${this.img}"
//                         data-price="${this.price}">Купить</button>
//                     </div>
//                 </div>`
//     }
// }
// class Cart {
//     constructor() {
//         this.products = []
//         this.container = '.cart-block'
//     }
//     render() {
//         let trg = document.querySelector (this.container)
//         let str = ''
//         this.products.forEach (prod => {
//             str += prod.render()
//         })
//         trg.innerHTML = str
//     }
//     addProduct (product) {
//         let productId = +product.dataset['id']; //data-id="1"
//         let find = this.products.find (element => element.id === productId); //товар или false
//         if (!find) {
//             this.products.push (new CartItem(product))
//         } else {
//             find.quantity++
//         }
//         this.render();
//     }
//     removeProduct (product) {
//         let productId = +product.dataset['id'];
//         let find = this.products.find (element => element.id === productId);
//         if (find.quantity > 1) {
//             find.quantity--;
//         } else {
//             this.products.splice(this.products.indexOf(find), 1);
//             document.querySelector(`.cart-item[data-id="${productId}"]`).remove()
//         }
//         this.render();
//     }
// }
//  class CartItem {
//     constructor(product) {
//         this.id = +product.dataset['id']
//         this.title = product.dataset['name']
//         this.price = +product.dataset['price']
//         this.img = cartImage
//         this.quantity = 1
//     }
//     render() {
//         return `<div class="cart-item" data-id="${this.id}">
//                     <div class="product-bio">
//                         <img src="${this.img}" alt="Some image">
//                         <div class="product-desc">
//                             <p class="product-title">${this.title}</p>
//                             <p class="product-quantity">Quantity: ${this.quantity}</p>
//                             <p class="product-single-price">$${this.price} each</p>
//                         </div>
//                     </div>
//                     <div class="right-block">
//                         <p class="product-price">${this.quantity * this.price}</p>
//                         <button class="del-btn" data-id="${this.id}">&times;</button>
//                     </div>
//                 </div>`
//     }
//  }

