import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";

// Define which routes should be accessible without authentication
// This creates a function that checks if a request URL matches any of these public paths
const isPublicRoute = createRouteMatcher(["/", "/sign-in", "/sign-up"]);

// Export the Clerk middleware with custom authentication logic
export default clerkMiddleware(async (auth, req: NextRequest) => {

  // If the request is for a public route, allow access without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // For non-public routes, check if the user is authenticated
  // The auth() function returns user information from Clerk
  const { userId } = await auth(); 

  // If no user ID is found, the user is not authenticated
  // Redirect them to the sign-in page
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If the user is authenticated, allow the request to proceed
  return NextResponse.next();
});


/**
 * Configure which paths the middleware should run on.
 * This uses a matcher pattern to apply the middleware to all routes except:
 * - Static files (which have extensions like .jpg, .css)
 * - Next.js internal routes (starting with _next)
 */
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
