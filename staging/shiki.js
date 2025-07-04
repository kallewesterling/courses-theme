// indicate that it is a module

const THEME = 'vitesse-dark'; // Shiki theme to use

import { codeToHtml } from 'https://esm.sh/shiki@3.0.0'

document.querySelectorAll("code[data-lang]").forEach(async (codeElement) => {
    const lang = codeElement.dataset.lang;
    const code = codeElement.textContent.trim();
    const html = await codeToHtml(code, { lang, theme: THEME });
    codeElement.parentElement.outerHTML = html; // Replace the code element with highlighted HTML
    console.log(codeElement);
    console.log(html);
    console.log("--------");
});
