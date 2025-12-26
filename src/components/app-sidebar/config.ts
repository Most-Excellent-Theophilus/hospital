import { IconType } from "react-icons";
import { CgMenuGridO } from "react-icons/cg";

import { LuAppWindow } from "react-icons/lu";
import { FaFileAlt, FaHome } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

export type DashBoardLinksType =
  | "users"
  | "account"
  | "postOp"
  | "preOp"
  | "home"
  | "system";
export type DashBoardUrl = DashBoardLinksType
export const linksIconMap: Record<
  DashBoardLinksType,
  { icon: IconType; name: string; url: DashBoardUrl }
> = {
  home: {
    name: "Home",
    icon: FaHome,
    url: "home",
  },
  account: {
    name: "Patients",
    icon: FaFileAlt,
    url: "account",
  },
  preOp: {
    icon: CgMenuGridO,
    name: "Pre Operation",
    url: "preOp",
  },
  postOp: {
    icon: LuAppWindow,
    name: "Post Operation ",
    url: "postOp",
  },
  users: {
    name: "Doctors",
    icon: FaCircleUser,
    url: "users",
  },
  system: {
    name: "System",
    icon: FaCircleUser,
    url: "system",
  },
};
