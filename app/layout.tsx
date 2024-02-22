import './globals.css';
import '@smastrom/react-rating/style.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import localFont from 'next/font/local';
import { Poppins, Josefin_Sans } from 'next/font/google';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { cn } from '@/lib/utils';
import ToasterProvider from '@/providers/ToasterProvider';
import { Metadata } from 'next';
import TanstackProvider from '@/providers/TanstackProvider';
import Seed from '@/components/Seed';
import {
  generateInstructors,
  generateStudents,
} from '@/lib/actions/generate.actions';

const fabada = localFont({
  src: '../fonts/Fabada-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-fabada',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-josefin',
});

export const metadata: Metadata = {
  title: 'Lecturna',
  description:
    'Lecturna offers a coding course specifically designed to assist children in acquiring the skills necessary for creating websites, developing mobile apps, and engaging in game development.',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang='en'
      className={cn(fabada.variable, poppins.variable, josefin.variable)}
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <TanstackProvider>
          <MantineProvider
            theme={{
              primaryColor: 'primary-blue',
              colors: {
                'primary-blue': [
                  '#e9f0ff',
                  '#d2dcff',
                  '#a2b5f8',
                  '#708cf4',
                  '#466af0',
                  '#2c54ee',
                  '#1d49ee',
                  '#0f3bd4',
                  '#0434be',
                  '#002ca8',
                ],
              },
            }}
          >
            <ModalsProvider>
              {children}
              {/* <Seed /> */}
            </ModalsProvider>
          </MantineProvider>
        </TanstackProvider>
        <ToasterProvider />
      </body>
    </html>
  );
};

export default RootLayout;
