function addElement(elements, tr) {
  for (i = 0; i <= elements.length; ++i) {
    if (elements[i].tagName !== "INPUT") return

    var td = document.createElement("TD")
    td.innerHTML = elements[i].value
    tr.appendChild(td)
  }
}

function validates(elements) {
  var has_error,
    msg = '',
    errors = document.getElementById('errors')

  errors.innerHTML = ''

  for (i = 0; i < elements.length; ++i) {
    if (elements[i].tagName !== "INPUT") continue

    if (elements[i].name == "name") {
      has_error = elements[i].value.match(/[^a-zA-Z]/g) !== null
    }
    if (elements[i].name == "phone") {
      has_error = !has_error? elements[i].value.match(/[^0-9()-]/g) !== null : has_error
    }
  }

  if (has_error) {
    errors.innerHTML = 'Preencha os campos corretamente'
    return false
  }

  return true
}

var form = document.getElementById('form')

// Save
form.addEventListener('submit', function(e) {
  e.preventDefault()

  if (! validates(form.elements)) return false

  var tr = document.createElement("TR")
  addElement(form.elements, tr)

  document.getElementById('tbody').appendChild(tr)
})
