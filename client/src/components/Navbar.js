import React from 'react'

export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-md   pt-5 pb-3  mb-5">
    <div class="container-xxl">
      <img
        src="./favicon.ico"
        alt="Logo"
        className=" me-2"
      />
      <span class="text-dark fs-4 fw-bold">Xero Integration</span>

      <div
        class="collapse navbar-collapse justify-content-end align-center "
        id="main-nav"
      >

      </div>
    </div>
  </nav>
  )
}
