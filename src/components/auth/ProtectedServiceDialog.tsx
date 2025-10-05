'use client';
import { protectedServiceDialogStore } from '@/lib/stores/protectedServiceDialogStore';
import ResponsiveDialog from '../ui/ResponsiveDialog';
import { observer } from 'mobx-react-lite';
import { Button } from '../ui/button';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const ProtectedServiceDialog = observer(() => {
  const pathname = usePathname();

  return (
    <ResponsiveDialog
      open={protectedServiceDialogStore.isOpen}
      onOpenChange={protectedServiceDialogStore.close}
      title={protectedServiceDialogStore.title}
      description={protectedServiceDialogStore.message}
    >
      <p>
        Don&apos;t worry! Your resume data stays private at all times and is not
        shared with any third-party services
      </p>
      <div className={'w-full flex items-center gap-2 mt-4 justify-between'}>
        <div>
          <Button onClick={protectedServiceDialogStore.close} variant="outline">
            Close
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <SignUpButton
            fallbackRedirectUrl={pathname}
            signInFallbackRedirectUrl={pathname}
          >
            <Button variant="secondary">Sign Up</Button>
          </SignUpButton>
          <SignInButton
            fallbackRedirectUrl={pathname}
            signUpFallbackRedirectUrl={pathname}
          >
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </div>
    </ResponsiveDialog>
  );
});

export default ProtectedServiceDialog;
