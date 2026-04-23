const fontWeight = "font-weight:600;";

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
  get isEnabled() {
    try {
      return JSON.parse(localStorage.getItem("DEBUG_FLAGS") || "{}").logging === true;
    } catch {
      return false;
    }
  },

  /**
   * Logs an informational message to the console with styling.
   * @param {string} message - The message to log.
   * @param {...any} args - Additional arguments to log.
   * @returns {void}
   */
  info(message, ...args) {
    if (!this.isEnabled) return;
    const style = `color:darkblue;${fontWeight}`;
    console.info(`%c[CG] ${message}`, style, ...args);
  },

  /**
   * Logs a warning message to the console with styling.
   * @param {string} message - The warning message to log.
   * @param {...any} args - Additional arguments to log.
   * @returns {void}
   */
  warn(message, ...args) {
    if (!this.isEnabled) return;
    const style = `color:darkorange;${fontWeight}`;
    console.warn(`%c[CG] ${message}`, style, ...args);
  },

  /**
   * Logs an error message to the console with styling.
   * @param {string} message - The error message to log.
   * @param {...any} args - Additional arguments to log.
   * @returns {void}
   */
  error(message, ...args) {
    if (!this.isEnabled) return;
    const style = `color:darkred;${fontWeight}`;
    console.error(`%c[CG] ${message}`, style, ...args);
  },
};
