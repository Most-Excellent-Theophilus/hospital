import { Hospital } from "lucide-react";

type LogoProps = React.SVGProps<SVGSVGElement>;

const Logo: React.FC<LogoProps> = (props) => {
    return <Hospital {...props} />;
}
 
export default Logo;