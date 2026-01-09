import { CG } from "./CG.mjs";

/**
 * Simple logger utility for console messages with styling.
 * Logs messages only if in staging or admin environment.
 * @returns {void}
 */
export const logger = {
  /**
   * Determines if logging is enabled based on the environment.
   * @returns {boolean} True if logging is enabled, false otherwise.
   */
  enabled() {
    return (
      CG.env.isStaging || CG.env.isAdmin || CG.page.isSignup || CG.page.isLogin
    );
  },

  /**
   * Logs an informational message to the console with styling.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @returns {void}
   */
  info(message, ...args) {
    if (!this.enabled()) return;
    const style = "color: var(--primary-blue-hex); font-weight: 600;";
    console.info(`%c[CG] ${message}`, style, ...args);
  },

  /**
   * Logs a warning message to the console with styling.
   * @param {string} message - The warning message to log.
   * @param {...any} args - Additional arguments to log.
   * @returns {void}
   */
  warn(message, ...args) {
    if (!this.enabled()) return;
    const style = "color: darkorange; font-weight: 600;";
    console.warn(`%c[CG] ${message}`, style, ...args);
  },

  /**
   * Logs an error message to the console with styling.
   * @param {string} message - The error message to log.
   * @param {...any} args - Additional arguments to log.
   * @returns {void}
   */
  error(message, ...args) {
    if (!this.enabled()) return;
    const style = "color: darkred; font-weight: 600;";
    console.error(`%c[CG] ${message}`, style, ...args);
  },
};
