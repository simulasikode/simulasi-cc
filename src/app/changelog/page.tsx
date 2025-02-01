"use client"; // MDX requires client-side rendering

import { MDXProvider } from "@mdx-js/react";
import Layout from "@/components/Layout";
import ChangelogContent from "./Changelog.mdx"; // Import the MDX file

const ChangelogPage = () => {
  return (
    <MDXProvider>
      <Layout>
        <ChangelogContent />
      </Layout>
    </MDXProvider>
  );
};

export default ChangelogPage;
