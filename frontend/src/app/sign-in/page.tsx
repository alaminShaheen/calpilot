"use client";

import SignIn from "@/components/auth/SignIn";

// The authenticated-visitor redirect lives in withRedirectIfAuthenticated,
// which wraps SignIn.
const SignInPage = () => {
	return <SignIn />;
};

export default SignInPage;
