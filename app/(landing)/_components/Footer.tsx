import { footerLinks } from '@/constants';
import { Logo } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

type FooterColumnProps = {
  title: string;
  links: string[];
};

const FooterColumn = ({ title, links }: FooterColumnProps) => {
  return (
    <div className='footer_column' id='footer'>
      <h4 className='font-semibold'>{title}</h4>
      <ul className='flex flex-col gap-2 font-normal'>
        {links.map((link) => (
          <Link href='/' key={link}>
            {link}
          </Link>
        ))}
      </ul>
    </div>
  );
};

const Footer = ({ logo }: { logo: Logo }) => {
  return (
    <footer className='flexStart footer'>
      <div className='flex flex-col gap-12 w-full container'>
        <div className='flex items-start flex-col'>
          <Image
            src={logo?.image || '/logo.png'}
            width={80}
            height={80}
            alt='code harbor'
          />
          <p className='text-start text-sm font-normal mt-5 max-w-xs'>
            Lecturna, aplikasi LMS yang inovatif, menyediakan kursus koding
            interaktif untuk anak-anak usia 7-17 tahun.
          </p>
        </div>
        {/* <div className='flex flex-wrap gap-12'>
          <FooterColumn
            title={footerLinks[0].title}
            links={footerLinks[0].links}
          />
          <div className='flex-1 flex flex-col gap-4'>
            <FooterColumn
              title={footerLinks[1].title}
              links={footerLinks[1].links}
            />
            <FooterColumn
              title={footerLinks[2].title}
              links={footerLinks[2].links}
            />
          </div>
          <FooterColumn
            title={footerLinks[3].title}
            links={footerLinks[3].links}
          />
          <div className='flex-1 flex flex-col gap-4'>
            <FooterColumn
              title={footerLinks[4].title}
              links={footerLinks[4].links}
            />
            <FooterColumn
              title={footerLinks[5].title}
              links={footerLinks[5].links}
            />
          </div>
          <FooterColumn
            title={footerLinks[6].title}
            links={footerLinks[6].links}
          />
        </div> */}
      </div>

      <div className='flexBetween footer_copyright'>
        <p>&copy;{new Date().getFullYear()} Lecturna. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
