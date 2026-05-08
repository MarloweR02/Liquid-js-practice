const fadeInUp = document.querySelectorAll('.fade-in-up')

const observer = new IntersectionObserver((entries, observer)=>{
  entries.forEach((entry, index)=>{
    if(entry.isIntersecting){
      entry.target.classList.add('animate')
      observer.unobserve(entry.target)
      entry.target.style.animationDelay = `${index * 100}ms`
    }
  })
},
{
  threshold: 0.5
}
)

fadeInUp.forEach((el)=>{
  observer.observe(el)
})

