import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isRoute = createRouteMatcher(['/']);
const isPublicRoute = createRouteMatcher(['/', '/api/webhooks/clerk', '/api/webhooks/stripe']);

export default clerkMiddleware((auth,req)=>{
  if (isRoute(req)) auth().protect();
  if(isPublicRoute(req)){
    return
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};