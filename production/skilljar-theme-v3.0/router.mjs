import { CG } from "./CG.mjs";
import { pathUnregisteredView, pathRegisteredView } from "./views/path.mjs";
import {
  courseUnregisteredView,
  courseRegisteredView,
} from "./views/course.mjs";
import { lessonView } from "./views/lesson.mjs";
import { authView } from "./views/auth.mjs";
import { catalogView } from "./views/catalog.mjs";
import { notFoundView } from "./views/404.mjs";
import { logger } from "./logger.mjs";

/**
 * An array of page handlers that map specific page conditions to their corresponding view functions.
 * Each handler contains a test function to determine if the current page matches the condition,
 * and a handler function to execute if the condition is met.
 */
export const pageHandlers = [
  { test: () => CG.page.isLogin || CG.page.isSignup, handler: authView },
  { test: () => CG.page.isCourseUnregistered, handler: courseUnregisteredView },
  {
    test: () => CG.page.isCourseRegistered,
    handler: courseRegisteredView,
  },
  { test: () => CG.page.isPathUnregistered, handler: pathUnregisteredView },
  { test: () => CG.page.isPathRegistered, handler: pathRegisteredView },
  { test: () => CG.page.isLesson, handler: lessonView },
  { test: () => CG.page.isCatalog || CG.page.isLanding, handler: catalogView }, // TODO: I don't think CG.page.isLanding is needed
  { test: () => CG.page.is404, handler: notFoundView },
];

export function route() {
  // find first matching handler
  const match = pageHandlers.find(({ test }) => test());

  // run handler if found
  if (match) {
    logger.info(`Running page styling handler: ${match.handler.name}`);
    match.handler();
  } else {
    logger.warn("No page styling handler matched for this page.");
  }
}
