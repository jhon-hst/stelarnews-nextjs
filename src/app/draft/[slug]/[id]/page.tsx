import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Tables } from "@/types/database.types";
import { Categories } from "@/components/categories/Categories";
import Image from "next/image";


interface ArticlePageProps {
  params: {
    slug: string;
    id: string;
  };
}

type ArticleWithCategory = Tables<"articles"> & {
  categories: Tables<"categories"> | null;
};

export async function generateMetadata(
  {params}: ArticlePageProps
): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();

  const {id, slug} = await params

  const articleId = Number(id);

  const { data } = await supabase
    .from("articles")
    .select("*, categories(*)")
    .eq("id", articleId)
    .maybeSingle();

  const article = data as ArticleWithCategory | null;

  const title = article?.title ?? "Article";
  const description =
    article?.description ??
    "Read this curated news article on EstelarNews, your modern news portal.";
  const image =  article?.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${article?.image}` : "/logo.webp";
  const categoryName = article?.categories?.name ?? undefined;

  const urlSlug = slug || "featured-article";
  const urlId = id || "1";
  const url = `https://estelarnews.com/articles/${urlSlug}/${urlId}`;

  return {
    title: `${title} | EstelarNews`,
    description,
    keywords: categoryName
      ? [title, categoryName, "news", "article", "EstelarNews"]
      : [title, "news", "article", "EstelarNews"],
    openGraph: {
      title: `${title} | EstelarNews`,
      description,
      url,
      type: "article",
      section: categoryName,
      images: [
        {
          url: image,
          alt: title,
        },
      ],
      siteName: "EstelarNews",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | EstelarNews`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;
  const articleId = Number(id);

  const [{ data: articleData, error }, { data: categoriesData }] =
    await Promise.all([
      supabase
        .from("articles")
        .select("*, categories(*)")
        .eq("id", articleId)
        .maybeSingle(),
      supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true }),
    ]);


  if (error || !articleData) {
    return (
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-600">
          The requested article was not found.
        </p>
      </main>
    );
  }

  const article = articleData as ArticleWithCategory;
  const categories = (categoriesData ?? []) as Tables<"categories">[];

  return (
    <>
      <Categories
        categories={categories}
        activeCategoryId={article.category_id ?? undefined}
      />

      <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]"  >
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
  <section className="flex flex-col gap-4 border-b border-slate-100 pb-8">
    <p className="text-xs uppercase tracking-[0.25em] text-emerald-600 font-bold">Metabolic Health & Nutrition</p>
    <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
      7 &apos;Healthy&apos; Foods That Are Secretly Wrecking Your Metabolism
    </h1>
    <p className="max-w-3xl text-lg text-slate-600 leading-relaxed">
      The &quot;health halo&quot; effect is real. Many foods marketed as fitness-friendly are actually biochemical traps that spike insulin and stall your fat-burning engine.
    </p>
  </section>

  <div className="flex flex-col gap-12">
    {/* Food 1 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">1. Agave Nectar: The Fructose Trap</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Agave nectar being poured onto a bowl of fruit"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/agave.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Marketed as low-glycemic, agave is up to 90% fructose. Unlike glucose, fructose is processed entirely in the liver, where it can trigger fat storage and insulin resistance—the ultimate metabolic brake.
      </p>
      <div className="my-4 py-4 border-y border-slate-50 text-center">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest">Advertisement</span>
      </div>
    </section>

    {/* Food 2 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">2. &quot;Heart-Healthy&quot; Vegetable Oils</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Bottles of clear vegetable oils like canola and soybean"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/oils.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Industrial seed oils (soybean, corn, canola) are high in Omega-6 fatty acids. When consumed in excess, they cause systemic inflammation, making your mitochondria less efficient at producing energy.
      </p>
    </section>

    {/* Food 3 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">3. Commercial Granola</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Close up of crunchy granola with dried fruits"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/granola.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Most store-bought granolas are held together by sugar and inflammatory oils. A single serving can contain more sugar than a donut, causing a massive insulin spike that signals your body to store fat.
      </p>
      <div className="my-4 py-4 border-y border-slate-50 text-center">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest">Advertisement</span>
      </div>
    </section>

    {/* Food 4 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">4. Flavored Non-Fat Yogurt</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Strawberry flavored yogurt in a plastic cup"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/yogurt.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        When fat is removed, manufacturers add sugar and thickeners to fix the taste. Without healthy fats to slow digestion, the added sugars hit your bloodstream instantly, crashing your energy hours later.
      </p>
    </section>

    {/* Food 5 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">5. Bottled Green Juices</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="A bottle of bright green juice showing high sugar content on label"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/green-juice.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Many &quot;detox&quot; juices are stripped of fiber and bulked with apple juice. You&apos;re essentially drinking liquid sugar, which spikes blood glucose and puts your metabolism into storage mode.
      </p>
    </section>

    {/* Food 6 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">6. Veggie Chips & Straws</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Multi-colored veggie straws in a bowl"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/veggie-chips.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        These are often just potato starch and corn flour with vegetable powder for color. They lack the thermic effect of real whole vegetables, offering high calories with zero metabolic work required.
      </p>
    </section>

    {/* Food 7 */}
    <section className="flex flex-col gap-4 pb-12">
      <h2 className="text-2xl font-bold text-slate-900">7. Diet Soda & Sweeteners</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="A glass of soda with ice and a diet label"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/metabolism-wreckers/diet-soda.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Zero calories doesn&apos;t mean zero impact. Artificial sweeteners can disrupt your gut microbiome and confuse your brain&apos;s hunger signals, often leading to increased insulin levels and weight gain.
      </p>
    </section>
  </div>
</main>



        </div>
 
    </>
  );
}
