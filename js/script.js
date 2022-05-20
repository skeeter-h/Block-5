// ************************************************
// Shopping Cart API taken from Codehim: https://www.codehim.com/collections/javascript-shopping-cart-examples-with-demo/ by Chris_Achinga 
// ************************************************

var shoppingCart = (function() {
  // =============================
  // Private methods and propeties
  // =============================
  cart = [];
  
  // Constructor for each item (it will have a name, price and count associated with it)
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }
  
  // Save cart (Save cart so even if page is refreshed, items are still in basket)
  function saveCart() {
    sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
  }
  
    // Load cart (Loads the saved cart from previous sessions)
  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
  }
  if (sessionStorage.getItem("shoppingCart") != null) {
    loadCart();
  }
  

  // =============================
  // Public methods and propeties
  // =============================
  var obj = {}; //Create an object that stores (using function addItemToCart) 
  
  // Add to cart object (this way a new instance of that item can be made each time and treated as a function to represent new item)
  obj.addItemToCart = function(name, price, count) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart[item].count ++;  //Checking to see if there are any previous items with the same name (if there are the the added count will be registered and function will return)
        saveCart();
        return;
      }
    }

    
    var item = new Item(name, price, count); //New item created if there are no items that match before it
    
    if(window.confirm(item.name + " has been added to cart")) { //First time an item is added, the user is prompted, after that they are no longer asked
      cart.push(item);
      saveCart();
    } else {
      return 0;
    }
    
  }
  // Set count from item
  obj.setCountForItem = function(name, count) {
    for(var i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) { //For loop where by if name matches then item count is lowered
          cart[item].count --;
          if(cart[item].count === 0) { //If the count is already 0 then the item is removed from the cart array permanently
            cart.splice(item, 1);
          }
          break;
        }
    }
    saveCart();
  }

  // Remove all items from cart
  obj.removeItemFromCartAll = function(name) {
    for(var item in cart) {
      if(cart[item].name === name) {
        cart.splice(item, 1); //All existing items that match the names of those in the cart are removed
        break;
      }
    }
    saveCart();
  }

  // remove everything from cart
  obj.clearCart = function() {
    if(cart.length == 0) {
      alert("There are no items in your basket...") //Added code to prompt user or alert them that there are no items
    }
      else { 
      if(window.confirm("Delete all items from cart? ")) { //Ask for confirmation from users before clearing basket
        cart = [];
        saveCart();
      }

    }
    

  }

  // Count cart (get total count of an item)
  obj.totalCount = function() {
    var totalCount = 0;
    for(var item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  }

  // Total cart, get the total price of a cart depending on the count of each item
  obj.totalCart = function() {
    var totalCart = 0;
    for(var item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2)); //Round number to two decimal places 
  }

  // List cart, every item is pushed to an array so that you can get a list of the items
  obj.listCart = function() {
    var cartCopy = [];
    for(i in cart) {
      item = cart[i];
      itemCopy = {};
      for(p in item) {
        itemCopy[p] = item[p]; 

      }
      itemCopy.total = Number(item.price * item.count).toFixed(2); //If multiple of the same items are added then the price is calculated 
      cartCopy.push(itemCopy) //Then the copy of those items is added to cart
    }
    return cartCopy;
  }

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj; //list Cart is returned as an object
})();


// *****************************************
// Triggers / Events
// ***************************************** 
// Add item
$('.add-to-cart').click(function(event) { //Where the basket button is info is taken (as data) and will be used when adding/removing items
  event.preventDefault(); //Prevents items being added by default unless button explicitely clicked
  var name = $(this).data('name');
  var price = Number($(this).data('price')); //data is turned into an integer to be able to claculate total later 
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

//Own code written to "redeem" code and get reduction on items
$('.redeem').click(function(event) {
  if(document.getElementById('input').value == "SKEL22") { //If the value inputted is the same as available promo code then deduction occurs
    var total = shoppingCart.totalCart();
    total = total*0.95;
    document.getElementById('deducted').innerHTML = "New Total: £" + total.toFixed(2); //The new price is the printed below original
  } else { //Otherwise alert lets user know it's incorrect
    alert("Incorrect promo code, please try again");
  }
});

// Clear items
$('.clear-cart').click(function() {
  shoppingCart.clearCart();
  displayCart();
});

//Cart is displayed when basket (items) button is clicked 
function displayCart() {
  var cartArray = shoppingCart.listCart(); 
  var output = "";
  for(var i in cartArray) {
    output += "<tr>"
      + "<td>" + cartArray[i].name + "</td>" 
      + "<td>(" + cartArray[i].price + ")</td>" //Where code for for the increase/decrease button option is: they appear when item appears
      + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
      + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
      + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
      + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
      + " = " 
      + "<td>" + cartArray[i].total + "</td>" 
      +  "</tr>";
  }
  $('.show-cart').html(output); //Where total price will appear (find show-cart class in html file)
  $('.total-cart').html(shoppingCart.totalCart());
  $('.total-count').html(shoppingCart.totalCount());
}//Class names used to display information is areas specified 

// Delete item button
$('.show-cart').on("click", ".delete-item", function(event) {
  var name = $(this).data('name') //x button to delete all instances of that specific item in the
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
})


// -1 (Button to go down one count)
$('.show-cart').on("click", ".minus-item", function(event) { //Button to go down by one or up by one of specified item
  var name = $(this).data('name')
  shoppingCart.removeItemFromCart(name);
  displayCart();
})
// +1 (Button to go up one count)
$('.show-cart').on("click", ".plus-item", function(event) {//^^ the opposite
  var name = $(this).data('name')
  shoppingCart.addItemToCart(name);
  displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function(event) { //Input is taken and the count is changed to number specified for that item
   var name = $(this).data('name');
   var count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});


displayCart();