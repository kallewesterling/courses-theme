// indicate that it is a module

import { codeToHtml } from 'https://esm.sh/shiki@3.0.0'

const code = 'const a = 1' // input code
const html = await codeToHtml(code, {lang: 'javascript', theme : 'vitesse-dark'})

console.log(html) // highlighted html string