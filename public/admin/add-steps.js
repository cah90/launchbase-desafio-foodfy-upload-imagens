function addSteps() {
  console.log("i was clicked")
  const steps = document.querySelector("#steps")
  const fieldContainer = document.querySelectorAll(".step")

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

  if (newField.children[0].value == "") {
    return false
  }

  newField.children[0].value = ""
  steps.appendChild(newField)
}

document
  .querySelector(".add-step")
  .addEventListener("click", addSteps)

const PhotosUpload = {
  input: null,
  preview: document.querySelector('#photos-preview'),
  uploadLimit: 5,
  fileList: null,
  files: [],

  handleFileInput(event) {
    //const {files: fileList} = event.target
    this.fileList = event.target.files
    this.input = event.target

    if(this.hasLimit(event)) return
    
    Array.from(this.fileList).forEach((file) => {
      this.files.push(file)

      const reader = new FileReader() //it is an object that upload file into the browser
      //console.log('reader', reader)

      reader.onload = () => {
        const image = new Image()
        console.log('image', image)
        image.src = reader.result

        const div = this.getContainer(image)
        //console.log('div container', div)

        this.preview.appendChild(div)
      }

      reader.readAsDataURL(file)

    })

    this.input.files = this.getAllFiles()
  },

  hasLimit(event) {

    if (this.fileList.length > this.uploadLimit) {
      alert(`Envie no máximo ${this.uploadLimit} fotos`)
      event.preventDefault()
      return true
    } 
    return false
  },

  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    this.files.forEach(file => {
      dataTransfer.items.add(file)
      //console.log(dataTransfer)
    })
    return dataTransfer.files //atualiza o dataTransfer e faz um novo fileList
  },

  getContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = this.removePhoto

    div.appendChild(image)

    div.appendChild(this.getRemoveButton())

    return div
  },

  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = 'close'
    return button
  }, 

  removePhoto(event) {
    const photoDiv = event.target.parentNode // <div class="photo"></div> 
    const photosArray = Array.from(PhotosUpload.preview.children)
    const index = photosArray.indexOf(photoDiv)
    

    PhotosUpload.files.splice(index, 1)

    //console.log("PhotosUpload.files", PhotosUpload.files)

    PhotosUpload.input.files = PhotosUpload.getAllFiles()

    //console.log("PhotosUpload.input.files", PhotosUpload.input.files)

    photoDiv.remove()
  }  
}