import { londonTemplateStyles } from '@/components/appHome/resumeTemplates/london/london.styles';
import { PDF_BODY_FONT_SIZE } from '@/components/appHome/resumeTemplates/resumeTemplates.constants';
import { Text, View } from '@react-pdf/renderer';

interface TwoColumnLayoutProps {
  items: { label: string; value: string }[];
}

const TwoColumnLayout = ({ items }: TwoColumnLayoutProps) => {
  const itemsWithValue = items.filter((item) => item.value);
  if (itemsWithValue.length === 0) return null;

  return (
    <View
      style={{
        ...londonTemplateStyles.section,
        marginTop: 10,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: 5,
          columnGap: 5,
        }}
      >
        {itemsWithValue.map((item) => (
          <View
            style={{
              width: '46%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: PDF_BODY_FONT_SIZE,
            }}
            key={item.label}
          >
            <Text>{item.label}</Text>
            <Text>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TwoColumnLayout;
