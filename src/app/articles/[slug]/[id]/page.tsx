import type { Metadata } from "next";
import { Header } from "@/components/header/Header";
import { Categories } from "@/components/categories/Categories";
import { Footer } from "@/components/footer/Footer";
import { ArticleDetail } from "@/components/article/ArticleDetail";
import { ARTICLE_DETAIL } from "@/utils/articleDetail";

interface ArticlePageProps {
  params: {
    slug: string;
    id: string;
  };
}

export async function generateMetadata(
  props: ArticlePageProps
): Promise<Metadata> {
  const { title, description, image } = ARTICLE_DETAIL;

  const urlSlug = props.params.slug || "15-lugares-mas-hermosos";
  const urlId = props.params.id || "1";
  const url = `https://stelarnews.com/articulo/${urlSlug}/${urlId}`;

  return {
    title: `${title} | StelarNews`,
    description,
    openGraph: {
      title: `${title} | StelarNews`,
      description,
      url,
      type: "article",
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      siteName: "StelarNews",
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | StelarNews`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function ArticlePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]">

      <ArticleDetail />

    </div>
  );
}
