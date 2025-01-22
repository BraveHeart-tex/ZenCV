import App from '@/components/App';
import ClientOnly from '@/components/ClientOnly';

const Page = () => {
  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
};

export default Page;
