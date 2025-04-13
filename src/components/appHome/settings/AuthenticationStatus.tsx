import { Button } from '@/components/ui/button';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';
import { SignInButton, SignOutButton, useClerk, useUser } from '@clerk/nextjs';
import { CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useLocation } from 'react-router';

const aiPerks = [
  'Improve your profile summary or generate a new one',
  'Tailor your CV to the job posting',
  'Generate a cover letter',
];

const AuthenticationStatus = () => {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const location = useLocation();
  const pathname = location.pathname;
  const { signOut } = useClerk();

  const handleDeleteClerkAccount = () => {
    confirmDialogStore.showDialog({
      title: 'Are you sure you want to delete your account?',
      message:
        'Deleting your account will remove access to AI features. This action cannot be undone. Your local data (documents, templates, settings) will NOT be deleted.',
      async onConfirm() {
        const loadingToastId = showLoadingToast('Deleting your account...');
        if (!user || !isSignedIn) {
          showErrorToast('You must be signed in to delete your account.', {
            id: loadingToastId,
          });
          return;
        }

        setLoading(true);

        try {
          const response = await fetch('/api/auth/delete-clerk-account', {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete account');
          }

          const data = await response.json();
          if (!data?.success) {
            throw new Error('Failed to delete account');
          }

          await signOut({
            redirectUrl: pathname,
          });
          showSuccessToast('Your account has been deleted successfully.', {
            id: loadingToastId,
          });
          confirmDialogStore.hideDialog();
        } catch (error) {
          showErrorToast(
            'An error occurred while deleting your account. Please try again later.',
            {
              id: loadingToastId,
            },
          );
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      confirmText: 'Delete Account',
      cancelText: 'Cancel',
    });
  };

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
            <div className="sm:text-left flex flex-col gap-1">
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
          <div className="flex items-center justify-end gap-2 my-2">
            <Button
              variant="destructive"
              disabled={loading}
              onClick={handleDeleteClerkAccount}
            >
              Delete Account
            </Button>
            <SignOutButton
              signOutOptions={{
                redirectUrl: pathname,
              }}
            >
              <Button disabled={loading}>Sign out</Button>
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
            <Button disabled={loading}>Sign in</Button>
          </SignInButton>
        </>
      )}
    </div>
  );
};

export default AuthenticationStatus;
