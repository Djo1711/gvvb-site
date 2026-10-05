"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/le-club", label: "Le Club" },
  { href: "/equipes", label: "Équipes" },
  { href: "/entrainements", label: "Entraînements" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/inscription", label: "Inscription" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo-gvvb.png"
            alt="Logo GVVB"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <span className="font-heading font-bold text-lg leading-none">
            <span className="text-gvvb-red">GVVB</span>
            <span className="block text-xs font-normal text-gray-400 tracking-wide">
              Garches Vaucresson VB
            </span>
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`font-heading text-sm uppercase tracking-wide px-3 py-2 transition-colors ${
                    active
                      ? "text-gvvb-red border-b-2 border-gvvb-red"
                      : "text-gray-600 hover:text-gvvb-red"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/inscription"
          className="hidden lg:inline-flex items-center bg-gvvb-red text-white font-heading text-sm uppercase tracking-wider px-4 py-2 hover:bg-gvvb-red-dark transition-colors"
        >
          Nous rejoindre
        </Link>

        {/* Barres de 2px espacées de 6px : ±translate-y-2 (8px) les superpose au centre pour former la croix. */}
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Ouvrir le menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 my-1.5 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <ul className="flex flex-col px-4 py-3 gap-1">
            {links.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block font-heading text-sm uppercase tracking-wide py-2.5 px-3 transition-colors ${
                      active ? "text-gvvb-red border-l-2 border-gvvb-red pl-2" : "text-gray-600 hover:text-gvvb-red"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 pt-2 border-t border-gray-100">
              <Link
                href="/inscription"
                className="block bg-gvvb-red text-white font-heading text-sm uppercase tracking-wider px-4 py-2.5 text-center hover:bg-gvvb-red-dark transition-colors"
                onClick={() => setOpen(false)}
              >
                Nous rejoindre
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
