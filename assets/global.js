class CardATC extends HTMLElement{
  constructor(){
    super()

    this.form = this.querySelector("form[action='/cart/add']")
  }

  connectedCallback(){
    this.form.addEventListener("submit", this.handleClick.bind(this))
  }

  handleClick(e){
    e.preventDefault()

    let formData = {
      'items': [{
        'id': this.form.querySelector('input[name="id"]').value,
        'quantity': this.form.querySelector('input[name="quantity"]').value
        }],
        'sections': "cart-drawer,cart-count"
     };
     
     fetch(window.Shopify.routes.root + 'cart/add.js', {
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

customElements.define("card-atc", CardATC)







class CollectionFilter extends HTMLElement{
  constructor(){
    super()

    this.inputs = this.querySelectorAll('input[type="checkbox"]')
    this.mainCollection = document.querySelector('.main-collection')
  }

  connectedCallback(){
    this.inputs.forEach((input)=>{
      input.addEventListener('change', this.filterCollection.bind(this))
    })
  }

  get sectionId(){
    return this.dataset.sectionId
  }

  filterCollection(e){
   const target = e.currentTarget

   const url = new URL( target.checked ? target.dataset.addUrl : target.dataset.removeUrl, window.location.origin)
   url.searchParams.set('section_id', this.sectionId)
  
   fetch(url)
    .then((res)=>{
      return res.text()
    })
    .then((data)=>{
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = data

      this.mainCollection.innerHTML = tempDiv.querySelector('.main-collection').innerHTML

      url.searchParams.delete('section_id')
      window.history.pushState({},"",url.toString())
    })
    .catch((err)=>{
      console.error("Collection filter is not working", err)
    })
  }


  disconnectedCallback(){}
}

customElements.define('collection-filter', CollectionFilter)




class CollectionPagination extends HTMLElement{
  constructor(){
    super()

    this.pagination = this.querySelectorAll('.pagination-link')
    this.collection = document.querySelector('.main-collection')
  }

  get sectionId(){
    return this.dataset.sectionId
  }

  connectedCallback(){
    this.pagination.forEach((page)=>{
      page.addEventListener("click", this.handlePagination.bind(this))
    })
  }

  handlePagination(e){
    e.preventDefault()

    const url = new URL(e.currentTarget.href, window.location.origin)
    url.searchParams.set("section_id", this.sectionId)

    fetch(url)
     .then((res)=>{
      return res.text()
     })
     .then((data)=>{
      const fakeDiv = document.createElement('div')
      fakeDiv.innerHTML = data

      this.collection.innerHTML = fakeDiv.querySelector('.main-collection').innerHTML

      this.updateURL(url)
     })
     .catch((err)=>{
      console.error("Pagination is now working!", err)
     })
  }

  updateURL(url){
    url.searchParams.delete('section_id')
    window.history.pushState({}, "", url.toString())
  }

  disconnectedCallback(){}
}


customElements.define('collection-pagination', CollectionPagination)


class SortBy extends HTMLElement{
  constructor(){
    super()

    this.sort = this.querySelectorAll('.sort-option__link')
    this.sortHeader = this.querySelector('.sort-by__header')
    this.collection = document.querySelector('.main-collection')
  }

  connectedCallback(){
    this.sortHeader.addEventListener('click', this.openOptions.bind(this))
    this.sort.forEach((opt)=>{
      opt.addEventListener('click', this.handleClick.bind(this))
    })
  }

  get sectionId(){
    return  this.dataset.sectionId
  }

  handleClick(e){
    e.preventDefault()
    e.stopPropagation()

    const url = new URL(e.currentTarget.href, window.location.origin)
    url.searchParams.set('section_id', this.sectionId)

    fetch(url)
      .then((res)=>{
        return res.text()
      })
      .then((data)=>{
        const fakeDiv = document.createElement('div')
        fakeDiv.innerHTML = data
  
        this.collection.innerHTML = fakeDiv.querySelector('.main-collection').innerHTML
      })
      .catch((err)=>{
        console.error("SortBy is not working", err)
      })
  }

  openOptions(){
    this.toggleAttribute('open')
  }

  disconnectedCallback(){}
}

customElements.define('sort-by', SortBy)