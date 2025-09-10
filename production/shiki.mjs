const THEME = "min-light"; // Shiki theme to use

import { h } from "https://esm.sh/hastscript@9?bundle";

import * as shiki from "https://esm.sh/shiki@3.0.0";
window.shiki = shiki;
window.h = h;

/*
 * This function adds a copy button to code blocks.
 * It is used as a transformer for Shiki to modify blocks.
 */
function addCopyButton({ promptRE = /^\s*\$ /gm } = {}) {
  return {
    name: "shiki-transformer-copy-button",
    pre(node) {
      const onclick = String.raw`
        (async (btn) => {
          const pre = btn.parentElement;
          const code = pre.querySelector('code');
          const raw  = code ? code.innerText : pre.innerText;
          const text = raw.replace(${promptRE.toString()}, '');
          try {
            await navigator.clipboard.writeText(text);
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 2000);
          } catch (e) {
            btn.classList.add('error');
            setTimeout(() => btn.classList.remove('error'), 2000);
          }
        })(this);
      `;
      node.children.push(
        h("button", { class: "copy", type: "button", onclick }, [
          h("span", { class: "ready" }),
          h("span", { class: "success" }),
        ])
      );
    },
  };
}

const results = await Promise.all(
  Array.from(document.querySelectorAll("code[class*='language-']")).map(
    async (element) => {
      const cls =
        Array.from(element.classList).find((c) => c.startsWith("language-")) ||
        "language-text";
      const lang = cls.replace("language-", "");
      const code = element.textContent ?? "";
      const formatted = await shiki.codeToHtml(code, {
        lang,
        theme: THEME,
        transformers: [addCopyButton()],
      });
      return { element, formatted };
    }
  )
);

results.forEach(({ element, formatted }) => {
  const oldPre = element.closest("pre") || element.parentElement;
  if (!oldPre) return;

  // Parse Shiki output
  const tpl = document.createElement("template");
  tpl.innerHTML = formatted.trim();
  const newPre = tpl.content.firstElementChild;
  if (!newPre || newPre.tagName.toLowerCase() !== "pre") return;

  // ---- merge <pre> classes + preserve attrs ----
  const preClassSet = new Set([...newPre.classList, ...oldPre.classList]);
  newPre.className = [...preClassSet].join(" ");

  if (oldPre.hasAttribute("tabindex")) {
    newPre.setAttribute("tabindex", oldPre.getAttribute("tabindex"));
  }
  if (oldPre.hasAttribute("data-copy-added")) {
    newPre.setAttribute(
      "data-copy-added",
      oldPre.getAttribute("data-copy-added")
    );
  }

  // ---- merge <code> classes ----
  const oldCode = element;
  const newCode = newPre.querySelector("code");
  if (newCode) {
    const codeClassSet = new Set([...newCode.classList, ...oldCode.classList]);
    newCode.className = [...codeClassSet].join(" ");
  }

  // Swap in the upgraded <pre>
  oldPre.replaceWith(newPre);
});
