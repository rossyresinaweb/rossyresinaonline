import Image from "next/image";
import { Carousel } from "react-responsive-carousel";

const Banner = () => {
  const req: any = (require as any).context(
    "@/images/slider",
    false,
    /\.(png|jpe?g|webp)$/
  );
  const images: any[] = req
    .keys()
    .sort()
    .map((key: string) => req(key)?.default || req(key));

  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={3500}
      >
        {images.map((img, idx) => (
          <div key={idx}>
            <Image priority={idx === 0} src={img} alt={`Rossy Resina slider ${idx + 1}`} />
          </div>
        ))}
      </Carousel>
      <div className="w-full h-40 bg-gradient-to-t from-gray-100 to-transparent absolute bottom-0 z-10"></div>
    </div>
  );
};

export default Banner;
