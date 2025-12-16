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
export type DashBoardUrl = `?page=${DashBoardLinksType}` | `?`;
export const linksIconMap: Record<
  DashBoardLinksType,
  { icon: IconType; name: string; url: DashBoardUrl }
> = {
  home: {
    name: "Home & DashBoard",
    icon: FaHome,
    url: "?page=home",
  },
  preOp: {
    icon: CgMenuGridO,
    name: "Menu Links",
    url: "?page=preOp",
  },
  postOp: {
    icon: LuAppWindow,
    name: "Applications ",
    url: "?page=postOp",
  },
  account: {
    name: "Content",
    icon: FaFileAlt,
    url: "?page=account",
  },
  users: {
    name: "Users",
    icon: FaCircleUser,
    url: "?page=users",
  },
  system: {
    name: "System",
    icon: FaCircleUser,
    url: "?page=system",
  },
};
