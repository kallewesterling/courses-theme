// indicate that it is a module

const THEME = 'min-light'; // Shiki theme to use

import {h} from 'https://esm.sh/hastscript@9?bundle'
import { codeToHtml } from 'https://esm.sh/shiki@3.0.0'

function addCopyButton(options = {}) {
    // From https://github.com/joshnuss/shiki-transformer-copy-button
    const toggleMs = options.toggle || 3000

    return {
        name: 'shiki-transformer-copy-button',
        pre(node) {
            const button = h(
                'button',
                {
                    class: 'copy',
                    onclick: `
                        navigator.clipboard.writeText(this.parentElement.innerText.replace(/^\\$ /g,''));
                        this.classList.add('copied');
                        setTimeout(() => this.classList.remove('copied'), ${toggleMs})`
                },
                [h('span', { class: 'ready' }), h('span', { class: 'success' })]
            )
            node.children.push(button)
        }
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded and parsed");

    document.querySelectorAll("code[data-lang]").forEach(async (codeElement) => {
        const lang = codeElement.dataset.lang;
        const code = codeElement.textContent.trim();
        
        const html = await codeToHtml(code, { lang, theme: THEME, transformers: [addCopyButton({toggle: 2000})] });
        
        const parent = codeElement.parentElement;
        parent.outerHTML = html; // Replace the code element with highlighted HTML
        parent.dataset.lang = lang; // Preserve the language in the parent element
        
        console.log("--------");
        console.log("INFO");
        console.log(parent, parent.dataset);
        console.log("--------");
    });
});