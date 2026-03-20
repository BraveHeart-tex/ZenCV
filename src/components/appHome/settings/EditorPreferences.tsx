import { useAuth } from '@clerk/react';
import { CircleHelpIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNetworkState } from 'react-use';
import {
  SettingsRow,
  SettingsSectionHeader,
} from '@/components/appHome/settings/SettingsShared';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { handleEditorPreferenceChange } from '@/lib/client-db/userSettingsService';
import { userSettingsStore } from '@/lib/stores/userSettingsStore';

export const EditorPreferences = observer(() => {
  const { online } = useNetworkState();
  const { isSignedIn } = useAuth();

  return (
    <div className='space-y-6'>
      <SettingsSectionHeader
        title='Editor'
        description='Customize how the document builder behaves.'
      />
      <div className='space-y-1'>
        <SettingsRow
          label='Ask before deleting an item'
          htmlFor='askBeforeDeletingItem'
        >
          <Switch
            id='askBeforeDeletingItem'
            checked={userSettingsStore.editorPreferences.askBeforeDeletingItem}
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('askBeforeDeletingItem', checked)
            }
          />
        </SettingsRow>

        <SettingsRow
          label='Ask before deleting a section'
          htmlFor='askBeforeDeletingSection'
        >
          <Switch
            id='askBeforeDeletingSection'
            checked={
              userSettingsStore.editorPreferences.askBeforeDeletingSection
            }
            onCheckedChange={(checked) =>
              handleEditorPreferenceChange('askBeforeDeletingSection', checked)
            }
          />
        </SettingsRow>

        {online && (
          <SettingsRow
            label='Show AI suggestions'
            htmlFor='showAiSuggestions'
            description={
              !isSignedIn ? 'Sign in to enable AI features' : undefined
            }
            disabled={!isSignedIn}
            action={
              !isSignedIn && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size='xsIcon'
                        variant='ghost'
                        className='lg:inline-flex hidden'
                      >
                        <CircleHelpIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>You must be signed in to use AI features.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }
          >
            <Switch
              disabled={!isSignedIn}
              id='showAiSuggestions'
              checked={
                userSettingsStore.editorPreferences.showAiSuggestions &&
                !!isSignedIn
              }
              onCheckedChange={(checked) =>
                handleEditorPreferenceChange('showAiSuggestions', checked)
              }
            />
          </SettingsRow>
        )}
      </div>
    </div>
  );
});
