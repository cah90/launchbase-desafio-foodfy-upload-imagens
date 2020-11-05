function changeRecipeImages() {
  const biggerImage = document.querySelector(".wrapper .avatar img")
  const thumbnailImages = document.querySelectorAll(".thumbnail img")

  thumbnailImages[0].style.opacity = 1

  thumbnailImages.forEach(thumbnailImage => {
    thumbnailImage.addEventListener("click", () => {

      thumbnailImages.forEach(image => image.style.opacity = 0.5)
  
      thumbnailImage.style.opacity = 1

      biggerImage.src = thumbnailImage.src
    })
  })
}

changeRecipeImages()