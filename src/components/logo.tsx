
import Image from "next/image";

type LogoProps = React.ComponentProps<'img'>

const Logo: React.FC<LogoProps> = (props) => {
    return <Image {...props}  src={'/logo.png'} alt="logo Image" height={120} width={220} />;
}

export const LogoIcon: React.FC<LogoProps> = (props) => {
    return <Image {...props}  src={'/favicon.png'} alt="logo Icon" height={120} width={220} />;
}

 
export default Logo;