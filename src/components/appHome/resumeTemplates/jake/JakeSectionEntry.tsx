import { Text, View } from '@react-pdf/renderer';
import { JakeRichText } from './JakeRichText';
import { jakeStyles } from './jake.styles';

export const JakeSectionEntry = <T extends Readonly<Record<string, string>>>({
  entry,
  titleKey,
  subtitleKey,
}: {
  entry: T;
  titleKey: keyof T;
  subtitleKey?: keyof T;
}) => {
  const date = [entry.startDate, entry.endDate].filter(Boolean).join(' - ');
  const subtitle = subtitleKey ? entry[subtitleKey] : '';
  return (
    <View>
      <View
        style={jakeStyles.entryHeader}
        wrap={false}
        minPresenceAhead={entry.description ? 26 : 0}
      >
        <View style={jakeStyles.row}>
          <Text style={jakeStyles.title}>{entry[titleKey]}</Text>
          {date && <Text style={jakeStyles.date}>{date}</Text>}
        </View>
        {(subtitle || entry.city) && (
          <View style={jakeStyles.row}>
            <Text style={jakeStyles.subtitle}>{subtitle}</Text>
            {entry.city && <Text style={jakeStyles.city}>{entry.city}</Text>}
          </View>
        )}
      </View>
      {entry.description && <JakeRichText html={entry.description} />}
    </View>
  );
};
