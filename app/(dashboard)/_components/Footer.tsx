'use client';

const Footer = () => {
  return (
    <div className='flex justify-between bg-secondary p-5'>
      &copy; {new Date().getFullYear()} Lecturna
    </div>
  );
};

export default Footer;
