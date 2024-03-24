import React from "react";

export interface App {
  name: AppName;
  nav: {
    label: string;
    icon: React.ReactNode;
    pages: {
      label: string;
      page: React.ReactNode;
    }[];
  }[];
}
