let products = document.querySelector(".products_container");
let btns = document.querySelectorAll(".btns button")

// 1.Show products

fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then((data) => {
        data.forEach((item) => {
            products.innerHTML += `
                <div class="card">
                    <div class="image">
                     <img src=${item.image} alt="">
                    </div>
                    <h3>${item.title}</h3>
                </div>
        `
        })
    })

// 2.Filter

fetch("https://fakestoreapi.com/products/categories")
    .then(res => res.json())
    .then((data) => {
        btns.forEach((item, index) => {
            item.innerHTML = data[index];
            item.addEventListener("click", function () {
                const selectedCategory = data[index];

                btns.forEach(button => button.classList.remove("active"));
                this.classList.add("active");

                fetch("https://fakestoreapi.com/products")
                    .then(res => res.json())
                    .then((data) => {
                        const filteredProducts = data.filter(product => product.category === selectedCategory);

                        let productCardsHTML = "";
                        filteredProducts.forEach(product => {
                            productCardsHTML += `
                                <div class="card">
                                    <div class="image">
                                         <img src="${product.image}" alt="${product.title}">
                                    </div>
                                    <h3>${product.title}</h3>
                                </div>
              `;
                        });

                        products.innerHTML = productCardsHTML;
                    })
            })
        });

    })


const searchInput = document.getElementById('searchInput');
const listItems = document.querySelectorAll('#list .list-item');
let produc = [];

fetch("https://fakestoreapi.com/products")
    .then(response => response.json())
    .then(data => {
        produc = data;
        displayProducts(produc);
    });

    function displayProducts(produc) {
        const productList = document.getElementById('list');
        productList.innerHTML = '';

        produc.forEach(prod => {
            const li = document.createElement('li');
            li.textContent = prod.name;
            productList.appendChild(li);
        });
    }
    

    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredProducts = produc.filter(product => product.name.toLowerCase().includes(searchTerm));
        displayProducts(filteredProducts);
    });