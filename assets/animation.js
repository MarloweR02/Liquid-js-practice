function initAnimation(){
  const fadeInUpEl = document.querySelectorAll('.fade-in-up')

  const observer = new IntersectionObserver((entries, observer)=>{
    entries.forEach((entry, index)=>{
      if(entry.isIntersecting){
        entry.target.classList.add('animate')
        entry.target.style.animationDelay = `${index * 100}ms`
        observer.unobserve(entry.target)

      }
    })
  },
  {
    threshold: 0.2
  })

  fadeInUpEl.forEach((el)=>{
    observer.observe(el)
  })
}

initAnimation()