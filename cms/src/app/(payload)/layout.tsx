/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import config from "@payload-config";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./admin/importMap";

import "@payloadcms/next/css";

type Args = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Open Data App Portal CMS",
  description: "Redaktionssystem für das Open Data App Portal",
};

const serverFunction = async (args: any) => {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
