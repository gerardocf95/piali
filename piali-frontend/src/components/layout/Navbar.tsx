import Link from "next/link";

 export default function Navbar() {
   return (
     <nav className="flex justify-between items-center px-8 py-4 bg-surface2 border-b border-white/[0.07]">
       {/* Logo con gradiente */}
       <Link href="/" className="text-xl font-black"
         style={{ background: "linear-gradient(90deg,#e91e8c,#8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
         Piali
       </Link>

       <div className="hidden md:flex gap-8 text-sm text-white/60">
         <Link href="/"             className="hover:text-white transition-colors">Inicio</Link>
         <Link href="/destinations" className="hover:text-white transition-colors">Destinos</Link>
         <Link href="/tours"        className="hover:text-white transition-colors">Tours</Link>
         <Link href="/login"        className="hover:text-white transition-colors">Nosotros</Link>
       </div>

       <button className="text-sm font-bold text-white px-5 py-2 rounded-full"
         style={{ background: "linear-gradient(90deg,#e91e8c,#8b5cf6)" }}>
         Contáctanos
       </button>
     </nav>
   );
 }