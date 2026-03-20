import { SignInButton, SignOutButton, useClerk, useUser } from '@clerk/react';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsSectionHeader } from '@/components/appHome/settings/SettingsShared';
import { Button } from '@/components/ui/button';
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '@/components/ui/sonner';
import { endpoints } from '@/lib/endpoints';
import { confirmDialogStore } from '@/lib/stores/confirmDialogStore';

const aiPerks = [
  'Generate and improve your profile summary',
  'Tailor your CV to a specific job posting',
  'Get AI-powered keyword suggestions',
];

export const AuthenticationStatus = () => {
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const { pathname } = useLocation();
  const { signOut, session } = useClerk();

  const handleDeleteClerkAccount = () => {
    confirmDialogStore.showDialog({
      title: 'Delete account',
      message:
        'This removes access to AI features. Your local data (documents, settings) will not be affected.',
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
          const token = await session?.getToken();
          const response = await fetch(endpoints.auth.deleteAccount, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Failed to delete account');
          const data = await response.json();
          if (!data?.success) throw new Error('Failed to delete account');
          await signOut({ redirectUrl: pathname });
          showSuccessToast('Your account has been deleted.', {
            id: loadingToastId,
          });
          confirmDialogStore.hideDialog();
        } catch (error) {
          showErrorToast('Failed to delete account. Please try again.', {
            id: loadingToastId,
          });
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
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='Account'
        description='Manage your account and AI feature access.'
      />

      {isSignedIn ? (
        <div className='space-y-4'>
          <div className='flex items-center gap-4 p-4 rounded-lg border border-border/60 bg-muted/20'>
            {user.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.firstName || ''}
                width={48}
                height={48}
                className='w-12 h-12 rounded-full shrink-0'
              />
            )}
            <div className='min-w-0'>
              <p className='text-sm font-semibold truncate'>
                {user.firstName} {user.lastName}
              </p>
              <p className='text-xs text-muted-foreground'>
                Signed in · AI features enabled
              </p>
            </div>
          </div>
          <p className='text-xs text-muted-foreground'>
            Your account is only used to ensure fair usage of AI features. No
            data is collected for tracking.
          </p>
          <div className='flex items-center justify-end gap-2'>
            <Button
              variant='destructive'
              size='sm'
              disabled={loading}
              onClick={handleDeleteClerkAccount}
            >
              Delete account
            </Button>
            <SignOutButton signOutOptions={{ redirectUrl: pathname }}>
              <Button variant='outline' size='sm' disabled={loading}>
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3'>
            <p className='text-sm font-medium'>Sign in to unlock AI features</p>
            <ul className='space-y-2'>
              {aiPerks.map((perk) => (
                <li key={perk} className='flex items-center gap-2'>
                  <CheckIcon className='w-3.5 h-3.5 text-emerald-500 shrink-0' />
                  <span className='text-sm text-muted-foreground'>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className='text-xs text-muted-foreground'>
            Only used for fair usage of AI features. No tracking. Sign out or
            delete your account at any time.
          </p>
          <div className='flex justify-end'>
            <SignInButton
              fallbackRedirectUrl={pathname}
              signUpFallbackRedirectUrl={pathname}
            >
              <Button size='sm' disabled={loading}>
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>
      )}
    </div>
  );
};
