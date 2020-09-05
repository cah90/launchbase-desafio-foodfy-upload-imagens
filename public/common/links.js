function linkActive(id, pathname) {
  const link = document.querySelector(id)

  if (document.location.pathname.includes(pathname)) {
    link.classList.add("active")
  }
}

linkActive('#about', "/about")
linkActive('#recipes', "/recipes")
linkActive('#chefs', "/chefs")