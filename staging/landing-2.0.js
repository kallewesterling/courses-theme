// This file is for our new landing page design, for testing purposes currently.

const elems = {
    collections: {}
};

document.addEventListener("DOMContentLoaded", () => {
    console.info("Landing 2.0 script loaded");
    
    elems.header = document.querySelector(".page-content-block.html-content-block[data-index='0']");
    elems.collections.h2 = $('h2');
});