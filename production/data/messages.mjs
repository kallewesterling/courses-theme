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

/**
 * Static terms used across the course pages, such as labels for course details and buttons.
 * Centralizing these terms allows for consistent language throughout the application and makes it easier to update or localize in the future.
 */
export const term = {
    course: "Course",
    learningPath: "Learning Path",
    lesson: "Lesson",
    lessons: "Lessons",
    audience: "Audience",
    duration: "Duration",
    backToCourseDescription: "← Back to Course Description",
    logIn: "Log In",
    signUp: "Sign Up",
    continueWithGoogle: "Continue with Google",
    workEmail: "Work Email",
    firstName: "First Name",
    lastName: "Last Name",
    passwordConfirm: "Password Confirm",
    accessCode: "Access Code (optional)",
    partOf: "Part of",
    viewPath: "View path →",
}

/*
 * Tooltip descriptions shown when hovering the "Course" / "Learning Path"
 * floater labels in the page header.
 */
export const tooltips = {
    course: "A self-paced course covering a specific topic through a series of short lessons. Complete it at your own pace and revisit any lesson at any time.",
    learningPath: "A curated sequence of courses that guides you through a complete learning journey, from foundational concepts to advanced skills.",
}