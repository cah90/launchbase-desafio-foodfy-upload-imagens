function addSteps() {
  console.log("i was clicked")
  const steps = document.querySelector("#steps")
  const fieldContainer = document.querySelectorAll(".step")

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if(newField.children[0].value == "") {
    return false
  }

  newField.children[0].value = ""
  steps.appendChild(newField)
}

document
.querySelector(".add-step")
.addEventListener("click", addSteps)

const PhotosUpload = {
  uploadLimit: 5,
  
  handleFileInput(event) {
    const {files: fileList} = event.target

    if (fileList.length == 0) {
      alert("Envie pelo menos uma imagem.")
      event.preventDefault() 

    } else if (fileList.length > this.uploadLimit) {
      alert(`Envie no máximo ${this.uploadLimit} fotos`)
      event.preventDefault()
      
    } else {
      // The good case

    }

    Array.from(fileList).forEach( (file) => {
      return file.name 
    })
  }
}