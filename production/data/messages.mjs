/* 
 * This file contains static messages used across the application, such as error messages, notifications, and other user-facing text.
 * Centralizing these messages in one file allows for easier maintenance and updates, as well as potential localization in the future.
 * Each message is defined as a constant string that can be imported and used throughout the application wherever needed.
 */

/* 
 * Error message displayed to users who are partners trying to access Partner courses without being signed in.
 * This message includes a link to the login/signup page, guiding users to authenticate before accessing the content.
 */
export const partnerErrorMessage = `If you are a partner and trying to access our Partner courses, you have to first <a href="/auth/login?next=%2Fpage%2Fpartners">sign in or sign up for our Courses platform</a>.`