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