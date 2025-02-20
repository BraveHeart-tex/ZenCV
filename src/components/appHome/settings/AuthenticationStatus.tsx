import { Button } from '@/components/ui/button';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useLocation } from 'react-router';

const aiPerks = [
  'Improve your profile summary or generate a new one',
  'Tailor your CV to the job posting',
  'Generate a cover letter',
];

const AuthenticationStatus = () => {
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Authentication Status</h2>
      {isSignedIn ? (
        <div>
          <div className="sm:flex-row flex flex-col gap-4">
            {user.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.firstName || ''}
                width={96}
                height={96}
                className="sm:mx-0 w-24 h-24 mx-auto rounded-full"
              />
            ) : null}
            <div className="sm:text-left flex flex-col gap-1 text-center">
              <span className=" w-full font-semibold">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-muted-foreground text-sm">
                Only used for ensuring fair usage of AI features.
              </span>
              <span className="text-muted-foreground text-sm">
                No data is used for tracking. You can sign out or delete your
                account at any time.
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="destructive">Delete Account</Button>
            <SignOutButton
              signOutOptions={{
                redirectUrl: pathname,
              }}
            >
              <Button>Sign out</Button>
            </SignOutButton>
          </div>
        </div>
      ) : (
        <>
          <p>Sign in to access AI-powered suggestions: </p>
          <ul>
            {aiPerks.map((perk) => (
              <li key={perk} className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-green-500" />
                {perk}
              </li>
            ))}
          </ul>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">
              Only used for ensuring fair usage of AI features.
            </span>
            <span className="text-muted-foreground text-sm">
              No data is used for tracking. You can sign out or delete your
              account at any time.
            </span>
          </div>
          <SignInButton
            fallbackRedirectUrl={pathname}
            signUpFallbackRedirectUrl={pathname}
          >
            <Button>Sign in</Button>
          </SignInButton>
        </>
      )}
    </div>
  );
};

export default AuthenticationStatus;
