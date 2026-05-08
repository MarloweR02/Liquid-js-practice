class PredictiveSearch extends HTMLElement{
  constructor(){
    super()

    this.openTrigger = document.querySelector('.search-open-trigger')
    this.overlay = this.querySelector('.predictive-search__overlay')
    this.searchBar = this.querySelector('.predictive-search__input')
    this.body = document.querySelector('body')
    this.searchResult = this.querySelector('.predictive-search__results')
  }

  connectedCallback(){
    this.openTrigger.addEventListener('click', this.showSearch.bind(this))
    this.overlay.addEventListener('click', this.hideSearch.bind(this))
    this.searchBar.addEventListener('input', this.showResult.bind(this))

    this.showResult()
  }

  get sectionId(){
    return this.dataset.sectionId
  }

  showSearch(){
    this.setAttribute('open', "")
    this.body.classList.add('no-scroll')
  }
  
  hideSearch(){
    this.removeAttribute('open')
    this.body.classList.remove('no-scroll')
  }

  showResult(){
    const inputValue = this.searchBar.value.trim()

    if(inputValue.length >= 2 ){
      this.searchResult.setAttribute('show', '')

      const url = new URL( "/search/suggest",window.location.origin)
      url.searchParams.set('q',this.searchBar.value )
      url.searchParams.set('resources[type]', "product,collection,page,article")
      url.searchParams.set('section_id',this.sectionId )

      console.log(url)
      fetch(url)
        .then((res)=>{
          return res.text()
        })
        .then((data)=>{
          const tempDiv = document.createElement('div')
          tempDiv.innerHTML = data

          this.searchResult.innerHTML = tempDiv.querySelector('.predictive-search__results').innerHTML
        })
        .catch((err)=>{
          console.error("Predictive search not working", err)
        })

    } else {
      this.searchResult.removeAttribute('show')

    }
  }
  disconnectedCallback(){}
}

customElements.define('predictive-search', PredictiveSearch)