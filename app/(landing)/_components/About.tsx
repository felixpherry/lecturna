import Image from 'next/image';

const About = () => {
  return (
    <div className='bg-light-white w-full p-20'>
      <h1 className='mb-20 text-4xl text-center font-bold tracking-tight leading-none'>
        Tentang Kami
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 container'>
        <div className='flex flex-col items-center text-center'>
          <Image
            src='/about-us-1.jpg'
            height={200}
            width={200}
            className='object-cover w-[200px] h-[200px] rounded-full'
            alt='about us'
          />
          <h1 className='pt-6 pb-10 text-3xl font-bold'>Menyenangkan</h1>
          <div className='text-slate-500 text-md leading-8'>
            {' '}
            Lecturna adalah tempat di mana anak Anda dapat belajar koding secara
            menyenangkan dan mudah dipahami.
          </div>
        </div>
        <div className='flex flex-col items-center text-center'>
          <Image
            src='/about-us-2.jpg'
            height={200}
            width={200}
            className='object-cover w-[200px] h-[200px] rounded-full'
            alt='about us'
          />
          <h1 className='pt-6 pb-10 text-3xl font-bold'>Terstruktur</h1>
          <div className='text-slate-500 text-md leading-8'>
            Lecturna memiliki program pembelajaran yang terstruktur dan didesain
            khusus untuk anak-anak usia 7-17 tahun.
          </div>
        </div>

        <div className='flex flex-col items-center text-center'>
          <Image
            src='/about-us-3.jpg'
            height={200}
            width={200}
            className='object-cover w-[200px] h-[200px] rounded-full'
            alt='about us'
          />
          <h1 className='pt-6 pb-10 text-3xl font-bold'>Interaktif</h1>
          <div className='text-slate-500 text-md leading-8'>
            {' '}
            Anak-anak akan diajarkan konsep dasar koding melalui aktivitas yang
            menyenangkan seperti game, tantangan, proyek kreatif
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
