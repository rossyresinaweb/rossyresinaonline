import { Carousel } from "react-responsive-carousel";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    title: "Resina epoxica 1 en 1",
    subtitle: "Resina para elaboracion de proyectos personalizados en resina",
    href: "/categoria/resina",
    image: "/sliderImg_2.svg"
  },

 {
    title: "Nueva Ecoresina Ecologica",
    subtitle: "Resina ecologica no toxica para proyectos resineros artesanales",
    href: "/categoria/resina",
    image: "/sliderImg_3.svg",
  },

  {
    title: "Novedades Navideñas",
    subtitle: "Descubre nuestras novedades de temporada navideña 2025",
    href: "/categoria/resina",
    image: "/sliderImg_6.svg",
  },


  {
    title: "Moldes de silicona",
    subtitle: "Geométricos, personalizados y alta durabilidad",
    href: "/categoria/moldes-de-silicona",
    bg: "from-brand_teal to-brand_pink"
  },
  {
    title: "Pigmentos Perlados",
    subtitle: "Pigmentos perlados en polvo para colorear piezas",
    href: "/categoria/pigmentos",
    image: "/sliderImg_1.svg"
  }
];

export default function HeroCarousel() {
  return (
    <Carousel autoPlay infiniteLoop showStatus={false} showIndicators showThumbs={false} interval={5000}>
      {slides.map((s) => {
        const img: any = (s as any).image || (s as any).images;
        const gradient = (s as any).bg ? (s as any).bg : "from-black/20 to-black/0";
        return (
          <div key={s.title} className={`relative overflow-hidden rounded-lg min-h-[240px] md:min-h-[320px] lg:min-h-[384px]`}>
            {img && (
              <Image src={img} alt={s.title} fill className="object-cover" />
            )}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} ${img ? "opacity-50" : "opacity-100"}`}></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <div className="absolute inset-0 z-10 flex items-center justify-start text-white">
              <div className="w-full max-w-4xl pl-16 md:pl-28 lg:pl-40 py-0 text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.45)" }}>{s.title}</h2>
                <p className="mt-2 text-base md:text-lg opacity-95" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}>{s.subtitle}</p>
                <Link href={s.href} className="inline-block mt-4 px-4 py-2 rounded bg-white text-amazon_blue hover:bg-gray-100 font-semibold text-sm">Ver productos</Link>
              </div>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
}
