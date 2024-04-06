import React from "react";

export interface Applet {
  name: AppName;
  img: string;
  description: string;
  nav: {
    label: string;
    icon: React.ReactNode;
    pages: {
      label: string;
      page: React.ReactNode;
    }[];
  }[];
}
