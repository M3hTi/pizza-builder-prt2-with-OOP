const orderBtn = document.querySelector('.order-btn');
const pizzaBuilderEl = document.querySelector('.pizza-builder')

const order = {
    price: 0,
    size: {
        small: 10,
        medium:15,
        large:20,
        extraLarge:25
    },
    addPrice: function(obj) {
        this.price = 0
        this.price += (obj.toppings.length * 2) + this.size[obj.size];
        return this.price
    },
    tax: function() {
        return this.price * 0.08
    }
}


function Pizza(size) {
    this.size = size;
    this.toppings = [];
    
}
Pizza.prototype.addTopping = function(topping) {
    this.toppings.push(topping);
}

function Topping(name, side) {
    this.name = name;
    this.side = side;
}


function getToppingName(name) {
    const radioInputs = document.querySelectorAll(`input[name="${name}"]`);
    
    if (radioInputs.length === 0) {
        console.warn(`No radio inputs found for name: ${name}`);
    }
    
    for (const radio of radioInputs) {
        if (radio.checked) {
            return radio.value;
        }
    }
    
    console.warn(`No checked radio input found for name: ${name}`);
    return null;
}

// 1. Add form validation
function validatePizzaSelections() {
    const sections = document.querySelectorAll('.section');
    for (const section of sections) {
        const checkedTopping = section.querySelector('input[type="radio"]:checked');
        if (!checkedTopping) {
            alert(`Please select a topping for ${section.querySelector('h4').textContent}`);
            return false;
        }
    }
    return true;
}

function showMyPizza(obj) {
    const pizzaReview = document.createElement('div')
    pizzaReview.className = 'pizza-preview-container'


    const pizzaDetail = document.createElement('div')
    pizzaDetail.className = 'pizza-details'
    pizzaReview.appendChild(pizzaDetail)

    const heading = document.createElement('h3')
    heading.textContent = 'Your Pizza'
    pizzaDetail.appendChild(heading)
    
    const selectedToppings = document.createElement('div')
    selectedToppings.className = 'selected-toppings'
    pizzaDetail.appendChild(selectedToppings)

    const paragraph = document.createElement('p')
    paragraph.textContent = 'Selected Toppings:'
    selectedToppings.appendChild(paragraph)

    const ul = document.createElement('ul')
    selectedToppings.appendChild(ul)

    // Add toppings to the list
    obj.toppings.forEach(topping => {
        const li = document.createElement('li')
        li.textContent = `${topping.side}: ${topping.name}`
        ul.appendChild(li)
    })

    // Add price details
    const priceDetails = document.createElement('div')
    priceDetails.className = 'price-details'
    pizzaDetail.appendChild(priceDetails)

    // Size and base price
    const sizeItem = createPriceItem('Size:', obj.size)
    const basePrice = order.size[obj.size]
    const basePriceItem = createPriceItem('Base Price:', `$${basePrice}`)
    
    // Toppings price
    const toppingsPrice = obj.toppings.length * 2
    const toppingsPriceItem = createPriceItem('Toppings:', `$${toppingsPrice}`)
    
    // Tax calculation
    const subtotal = basePrice + toppingsPrice;
    const tax = subtotal * 0.08;
    const taxItem = createPriceItem('Tax (8%):', `$${tax.toFixed(2)}`);
    
    // Total price with tax
    const totalPriceItem = createPriceItem('Total:', `$${(subtotal + tax).toFixed(2)}`)
    totalPriceItem.classList.add('total')

    // Add all price items to price details
    priceDetails.appendChild(sizeItem)
    priceDetails.appendChild(basePriceItem)
    priceDetails.appendChild(toppingsPriceItem)
    priceDetails.appendChild(taxItem)
    priceDetails.appendChild(totalPriceItem)

    pizzaBuilderEl.appendChild(pizzaReview)
    
}

// Helper function to create price detail items
function createPriceItem(label, value) {
    const div = document.createElement('div')
    div.className = 'price-item'
    
    const labelSpan = document.createElement('span')
    labelSpan.textContent = label
    
    const valueSpan = document.createElement('span')
    valueSpan.textContent = value
    
    div.appendChild(labelSpan)
    div.appendChild(valueSpan)
    
    return div
}

orderBtn.addEventListener('click', () => {
    if (!validatePizzaSelections()) {
        return;
    }

    const pizzaReview = document.querySelector('.pizza-preview-container')
    if (pizzaReview) {
        pizzaBuilderEl.removeChild(pizzaReview)
    }

    const size = document.querySelector('#pizzaSize').value;
    const myPizza = new Pizza(size);
    // console.log(myPizza);
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        // console.dir(section);
        const side = section.id
        const toppingName = getToppingName(side);
        const myTopping = new Topping(toppingName, side);
        myPizza.addTopping(myTopping);
    })
    // console.log('Final pizza:', myPizza);
    order.addPrice(myPizza);
    const tax = order.tax();
    console.log(tax);
    console.log(order);
    showMyPizza(myPizza)
})
