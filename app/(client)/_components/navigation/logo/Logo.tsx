import Image from "next/image";

interface LogoProps {
  src: string;
  alt: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ src, alt, className = "" }) => {
  return (
    <div className="relative h-[50px] w-[50px] rounded-full overflow-hidden">
      <Image src={src} alt={alt} fill className={`object-cover ${className}`} />
    </div>
  );
};

export default Logo;
