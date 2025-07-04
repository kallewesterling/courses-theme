// indicate that it is a module

const THEME = 'min-light'; // Shiki theme to use

import { codeToHtml } from 'https://esm.sh/shiki@3.0.0'

document.querySelectorAll("code[data-lang]").forEach(async (codeElement) => {
    const lang = codeElement.dataset.lang;
    const code = codeElement.textContent.trim();
    const html = await codeToHtml(code, { lang, theme: THEME });
    codeElement.parentElement.outerHTML = html; // Replace the code element with highlighted HTML
    codeElement.parentElement.style.backgroundColor = `${codeElement.parentElement.style.backgroundColor} !important`;
    console.log(codeElement);
    console.log(html);
    console.log("--------");
});
