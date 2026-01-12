/*
 * Chainguard Courses Theme v4.0
 * This preload script is executed before the main theme script.
 * It sets the body's display to "none" to prevent FOUC (Flash of Unstyled Content).
 * See the main theme script for further details (theme.mjs).
*/
document.querySelector("body").style.setProperty("display", "none");