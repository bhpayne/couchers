import { appGetLayout } from "components/AppRoute";
import Home from "features/dashboard/Home";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["global", "dashboard"])),
  },
});

export default function HomePage() {
  return <Home />;
}

HomePage.getLayout = appGetLayout();
