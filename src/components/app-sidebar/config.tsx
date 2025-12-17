"use client"

import {
  LayoutGrid as CgMenuGridO,
  AppWindow as LuAppWindow,
  FileText as FaFileAlt,
  Home as FaHome,
  CircleUser as FaCircleUser,
  Settings

} from "lucide-react";

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
  { icon: typeof CgMenuGridO; name: string; url: DashBoardUrl }
> = {
  home: {
    name: "Home",
    icon: FaHome,
    url: "?page=home",
  },
  account: {
    name: "Patients",
    icon: FaFileAlt,
    url: "?page=account",
  },
  preOp: {
    icon: CgMenuGridO,
    name: "Pre Operation",
    url: "?page=preOp",
  },
  postOp: {
    icon: LuAppWindow,
    name: "Post Operation ",
    url: "?page=postOp",
  },
  users: {
    name: "Doctors",
    icon: FaCircleUser,
    url: "?page=users",
  },
  system: {
    name: "System",
    icon: Settings,
    url: "?page=system",
  },
};
