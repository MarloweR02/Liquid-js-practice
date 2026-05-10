class AnnouncementBar extends HTMLElement{
  constructor(){
    super()

    this.announcement = this.querySelectorAll('.announcement-message')
    this.carousel = this.querySelector('.announcement-carousel')
    this.previous = this.querySelector('[previous-slide]')
    this.next = this.querySelector('[next-slide]')
    this.closeTrigger = this.querySelector('[close-trigger]')

    this.currentIndex = 0
  }

  connectedCallback(){
    this.next.addEventListener("click", this.nextSlide.bind(this))
    this.previous.addEventListener("click", this.previousSlide.bind(this))
    this.closeTrigger.addEventListener('click', this.handleClose.bind(this))

    setInterval(() => {
      this.nextSlide()
    }, 3500);
  }

  nextSlide(){
    this.currentIndex++

    if(this.currentIndex >= this.announcement.length){
      this.currentIndex = 0
    }

    this.updateSlide()
  } 

  previousSlide(){
    this.currentIndex--

    if(this.currentIndex < 0 ){
      this.currentIndex = this.announcement.length - 1
    }

    this.updateSlide()
  }

  updateSlide(){
    const offset = this.currentIndex * 100
    this.carousel.style.transform = `translateX(-${offset}%)`
  }

  handleClose(){
    this.classList.add('is-closing')
  }

  disconnectedCallback(){}
}

customElements.define('announcement-bar', AnnouncementBar)