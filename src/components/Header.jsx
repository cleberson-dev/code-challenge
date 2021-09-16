import { useRouter } from "next/router";
import Link from 'next/link';

export default function Header() {
  const router = useRouter();
  const path = router.pathname;
  const link = path === '/teams' ? 
    { href: '/create', title: 'Create a new team' } : 
    { href: '/teams', title: 'Teams' };

  return (
    <header 
      style={{ backgroundColor: '#90ADC6' }} 
      className="h-36 flex flex-col justify-end items-center py-2"
    >
      <div className="bg-white w-4/5 h-1 mb-2"></div>
      <h1 
        style={{ fontFamily: 'Spartan ExtraBold' }}
        className="text-white text-xl uppercase hover:opacity-70"
      >
        <Link href={link.href}>
          <a>{link.title}</a>
        </Link>
      </h1>
    </header>
  );
}