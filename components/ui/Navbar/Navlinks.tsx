'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import Logo from '@/components/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import s from './Navbar.module.css';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = getRedirectMethod() === 'client' ? useRouter() : null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
      {/* Logo Section */}
      <div className="flex items-center flex-1">
        <Link href="/" className={s.logo} aria-label="Logo">
          <Logo />
        </Link>

        {/* Toggle Button for Small Screens */}
        <button
          className="ml-auto block lg:hidden p-2 rounded-md focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav
  className={`${
    isMenuOpen ? 'block' : 'hidden'
  } absolute top-full left-0 w-full bg-black text-gray-400 shadow-lg space-y-4 p-4 lg:static lg:block lg:bg-transparent lg:shadow-none lg:w-auto lg:space-y-0 lg:space-x-2 lg:flex`}
>
  <Link href="/" className={s.link}>
    Home
  </Link>
  {user && (
    <Link href="/account" className={s.link}>
      Account
    </Link>
  )}
  {user && (
    <Link href="/Solutions" className={s.link}>
      Solutions
    </Link>
  )}
  {user && (
    <Link href="/to" className={s.link}>
      Messenger
    </Link>
  )}
  {user && (
    <Link href="/emailing" className={s.link}>
      Email
    </Link>
  )}
</nav>
      </div>

      {/* Sign In / Sign Out Section */}
      <div className="flex justify-end space-x-8">
        {user ? (
          <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
            <input type="hidden" name="pathName" value={usePathname()} />
            <button type="submit" className={s.link}>
              Sign out
            </button>
          </form>
        ) : (
          <Link href="/signin" className={s.link}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
