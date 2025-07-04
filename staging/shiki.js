// indicate that it is a module

const THEME = 'min-light'; // Shiki theme to use

import { createHighlighter } from 'https://esm.sh/shiki@3.0.0'


// await document loaded
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded and parsed");
    
    const langs = document.querySelectorAll("code[data-lang]").forEach(codeElement => codeElement.dataset.lang) || [];

    window.highlighter = await createHighlighter({themes: [THEME], langs})

    document.querySelectorAll("code[data-lang]").forEach(async (codeElement) => {
        const lang = codeElement.dataset.lang;
        const code = codeElement.textContent.trim();
        
        const html = await window.highlighter.codeToHtml(code, { lang, theme: THEME });
        
        const parent = codeElement.parentElement;
        parent.outerHTML = html; // Replace the code element with highlighted HTML
        parent.dataset.lang = lang; // Preserve the language in the parent element
        
        console.log("--------");
        console.log("INFO");
        console.log(parent, parent.dataset);
        console.log("--------");
    });
});