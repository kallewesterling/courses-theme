// indicate that it is a module

const THEME = 'min-light'; // Shiki theme to use

import {h} from 'https://esm.sh/hastscript@9?bundle'
import { codeToHtml } from 'https://esm.sh/shiki@3.0.0'

function addCopyButton(options = {}) {
    // From https://github.com/joshnuss/shiki-transformer-copy-button

    return {
        name: 'shiki-transformer-copy-button',
        pre(node) {
            const button = h(
                'button',
                {
                    class: 'copy',
                    onclick: String.raw`
                        navigator.clipboard.writeText(this.parentElement.innerText.replace(/^\$ /g,''));
                        this.classList.add('copied');
                        setTimeout(() => this.classList.remove('copied'), 2000)`
                },
                [h('span', { class: 'ready' }), h('span', { class: 'success' })]
            )
            node.children.push(button)
        }
    }
}

document.querySelectorAll("code[data-lang]").forEach(async (codeElement) => {
    const lang = codeElement.dataset.lang;
    const code = codeElement.textContent.trim();
    
    const html = await codeToHtml(code, { lang, theme: THEME, transformers: [addCopyButton({toggle: 2000})] });
    
    const parent = codeElement.parentElement;
    parent.outerHTML = html; // Replace the code element with highlighted HTML
    parent.dataset.lang = lang; // Preserve the language in the parent element
});

document.addEventListener("DOMContentLoaded", async () => {
});