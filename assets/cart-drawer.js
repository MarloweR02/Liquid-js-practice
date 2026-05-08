class CartDrawer extends HTMLElement{
  constructor(){
    super()

    this.openTrigger = document.querySelector('.cart-open-trigger')
    this.cartOverlay = this.querySelector('.cart-drawer__overlay')
    this.cartDrawer = this.querySelector('.cart-drawer__main')
    this.cartCount = document.querySelector('.cart-count')
    this.body = document.querySelector('body')
  }

  connectedCallback(){
    this.openTrigger.addEventListener('click', this.cartOpen.bind(this))
    this.cartOverlay.addEventListener('click', this.cartClose.bind(this))
    document.addEventListener('cart:rerender', this.renderCart.bind(this))
  }

  cartOpen(){
    this.setAttribute('open', "")

    document.addEventListener("click", (e)=>{
      if(e.target.closest(".cart-close-trigger")){
        this.cartClose()
      }
    })

    this.body.classList.add("no-scroll")
  }

  cartClose(){
    this.removeAttribute('open')
    this.body.classList.remove("no-scroll")
  }

  renderCart(e){
    this.cartOpen()
    const newHTMLCart = e.detail.sections["cart-drawer"] 
    const fakeCart = document.createElement("div")
    fakeCart.innerHTML = newHTMLCart

    this.cartDrawer.innerHTML = fakeCart.querySelector('.cart-drawer__main').innerHTML
    
    const newHTMLCount = e.detail.sections["cart-count"] 
    const fakeCount = document.createElement("div")
    fakeCount.innerHTML = newHTMLCount
    
    this.cartCount.innerHTML = fakeCount.querySelector('.cart-count').innerHTML
  }

  disconnectedCallback(){}
}

customElements.define("cart-drawer", CartDrawer)


















class CartItem extends HTMLElement{
  constructor(){
    super()

    this.minus = this.querySelector('button[data-minus]')
    this.plus = this.querySelector('button[data-plus]')
    this.remove = this.querySelector('button[data-remove]')
    this.totalPrice = document.querySelector('.cart-drawer__total-price')
    this.loader = document.querySelector(".loading")
    this.quantity = this.querySelector('.cart-item__quantity-selector__quantity')
    this.cartItem = this
  }

  connectedCallback(){
    this.minus.addEventListener('click', this.handleChange.bind(this))
    this.plus.addEventListener('click', this.handleChange.bind(this))
    this.remove.addEventListener('click', this.handleChange.bind(this))
  }

  loading(isLoading){
    if (this.totalPrice){
      this.totalPrice.style.display = isLoading ? "none" : "block"
    }

    if(this.loader){
      this.loader.style.display = isLoading ? "block" : "none"
    }

    if(this.quantity){
      this.quantity.disabled = isLoading
      this.quantity.style.opacity = isLoading ? "0.6" : "1"
      this.quantity.style.cursor = isLoading ? "not-allowed" : "text"
    }
  }

  blinking(isLoading){
    if(this.cartItem){
      this.cartItem.classList.add('removing')
    }

    if (this.totalPrice){
      this.totalPrice.style.display = isLoading ? "none" : "block"
    }

    if(this.loader){
      this.loader.style.display = isLoading ? "block" : "none"
    }
  }

  handleChange(e){
    const isQuantityAction = e.currentTarget.hasAttribute("data-minus") || e.currentTarget.hasAttribute("data-plus")
    const isRemoveAction = e.currentTarget.hasAttribute('data-remove')

    if(isRemoveAction){
      this.blinking(true)
    }

    if(isQuantityAction){
      this.loading(true)
    }

    let formData ={
      "line": this.dataset.line,
      "quantity": e.currentTarget.dataset.quantity,
      "sections": "cart-drawer,cart-count"
    }

    fetch(window.Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      return response.json();
    })
    .then((data)=>{
     document.documentElement.dispatchEvent(
       new CustomEvent("cart:rerender",{
         detail: data,
         bubbles: true
       })
     )
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  disconnectedCallback(){}
}

customElements.define("cart-item", CartItem)

















class drawerActions extends HTMLElement{
  constructor(){
    super()

    this.code = this.querySelector('.cart-drawer__coupon-code')
    this.codeBtn = this.querySelector('.coupon-code__submit')
    this.codeField = this.querySelector('.coupon-code__field')
    this.removeCode = this.querySelectorAll('.remove-coupon-code')

    this.message = this.querySelector('.cart-drawer__message')
    this.messageInput = this.querySelector('.message__input')
    this.messageBtn = this.querySelector('.message__save-btn')
  }

  connectedCallback(){
    this.code.addEventListener("click", this.showCode.bind(this))
    this.codeBtn.addEventListener("click", this.checkCoupon.bind(this))

    this.message.addEventListener("click", this.showMessage.bind(this))
    this.removeCode.forEach((couponCode)=>{
      couponCode.addEventListener('click', this.deleteCode.bind(this))
    })

    this.messageBtn.addEventListener('click', this.submitMessage.bind(this))
    
    this.restoreActionState()
  }

  restoreActionState(){
    const active = localStorage.getItem('cart-actions')

    if(active === "code"){
      this.setAttribute('code', '')
    }
    if(active === "message"){
      this.setAttribute('message', '')
    }
  }

  showCode(){
    const isOpen = this.hasAttribute('code')

    if(isOpen){
      this.removeAttribute('code')
      localStorage.removeItem('cart-actions')
    } else{
      this.setAttribute('code', '')
      this.removeAttribute('message')
      localStorage.setItem('cart-actions', 'code')
    }
  }
  
  showMessage(){
    const isOpen = this.hasAttribute('message')
    
    if(isOpen){
      this.removeAttribute('message')
      localStorage.removeItem('cart-actions')
    } else{
      this.setAttribute('message', '')
      this.removeAttribute('code')
      localStorage.setItem('cart-actions', 'message')
    }
  }

  checkCoupon(){
    const inputCoupon = this.codeField.value
    const appliedCoupon = this.querySelectorAll('[data-coupon-code]')
    const arrayCoupon = Array.from(appliedCoupon).map((el) => el.dataset.couponCode)
    arrayCoupon.push(inputCoupon)
    const couponString = arrayCoupon.join(',')

    let formData = {
      discount: couponString,
      sections: "cart-drawer,cart-count"
    }

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      return response.json();
    })
    .then((data)=>{
     document.documentElement.dispatchEvent(
       new CustomEvent("cart:rerender",{
         detail: data,
         bubbles: true
       })
     )
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }

  deleteCode(e){
    const removedCoupon = e.currentTarget.closest('[data-coupon-code]').dataset.couponCode
    const appliedCoupon = this.querySelectorAll('[data-coupon-code]')
    const arrayCoupon = Array.from(appliedCoupon).map((el) => el.dataset.couponCode )
    const updateCoupon = arrayCoupon.filter((el) => el !== removedCoupon)
    const couponString = updateCoupon.join(',')

    let formData = {
      discount: couponString,
      sections: "cart-drawer,cart-count"
    }

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      return response.json();
    })
    .then((data)=>{
     document.documentElement.dispatchEvent(
       new CustomEvent("cart:rerender",{
         detail: data,
         bubbles: true
       })
     )
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  submitMessage(){
    const message = this.messageInput.value

    let formData ={
      note: message,
      sections: "cart-drawer,cart-count"
    }

    fetch(window.Shopify.routes.root + 'cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      return response.json();
    })
    .then((data)=>{
     document.documentElement.dispatchEvent(
       new CustomEvent("cart:rerender",{
         detail: data,
         bubbles: true
       })
     )
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  

  disconnectedCallback(){}
}

customElements.define('drawer-actions', drawerActions)