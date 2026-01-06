import { MdOutlineSick } from "react-icons/md";
import { FaCalendarMinus } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import { IconType } from "react-icons"
import { FaUserDoctor } from "react-icons/fa6";
import { RiHome5Fill } from "react-icons/ri";
import { GrSystem } from "react-icons/gr";
export type DashBoardLinksType =
  | "doctors"
  | "patients"
  | "pre-operation"
  | "post-operation"
  | "home"
  | "system";
export type DashBoardUrl = DashBoardLinksType
export const linksIconMap: Record<
  DashBoardLinksType,
  { icon: IconType; name: string; url: DashBoardUrl }
> = {
  home: {
    name: "Home",
    icon: RiHome5Fill,
    url: "home",
  },
  patients: {
    name: "Patients",
    icon: MdOutlineSick,
    url: "patients",
  },
  "post-operation": {
    icon: FaCalendarMinus,
    name: "Pre Operation",
    url: "post-operation",
  },
  "pre-operation": {
    icon: FaCalendarPlus,
    name: "Post Operation ",
    url: "pre-operation",
  },
  doctors: {
    name: "Doctors",
    icon: FaUserDoctor,
    url: "doctors",
  },
  system: {
    name: "System",
    icon: GrSystem,
    url: "system",
  },
};

export type Module = keyof typeof linksIconMap
const VALID_MODULES = Object.keys(linksIconMap);

const actions = ['create', 'update', 'view', 'delete']

export const isValidModule = (m: string): m is Module => VALID_MODULES.concat(['account']).includes(m as Module);
export const isValidAction = (a: string) => actions.includes(a)