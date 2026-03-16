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
    <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-bold">Future Tech & Productivity</p>
    <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
      8 Insane AI Tools That Will Make Your Laptop Feel Like a Supercomputer
    </h1>
    <p className="max-w-3xl text-lg text-slate-600 leading-relaxed">
      You dont need a $10,000 rig to handle heavy-duty tasks anymore. These cutting-edge AI tools optimize your hardware and automate the impossible, turning your standard laptop into a powerhouse.
    </p>
  </section>

  <div className="flex flex-col gap-12">
    {/* Tool 1 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">1. Local LLM Integration: Private Intelligence</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Laptop screen showing complex code and neural nodes in a dark room"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/local-llm.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Run massive language models directly on your machine without an internet connection. Tools like LM Studio or Ollama utilize your local GPU to give you a private, lightning-fast AI assistant.
      </p>
      <div className="my-4 py-4 border-y border-slate-50 text-center">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest">Advertisement</span>
      </div>
    </section>

    {/* Tool 2 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">2. AI Video Upscalers</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Split screen showing low resolution vs 8K crystal clear landscape"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/upscaler.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Transform grainy 1080p footage into cinematic 4K. Using neural networks, these tools reconstruct missing pixels in real-time, delivering professional-grade visual fidelity on standard hardware.
      </p>
    </section>

    {/* Tool 3 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">3. Neural Noise Cancellation</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Person working in a loud coffee shop with sleek headphones"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/noise-cancel.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Eliminate background chaos during calls. AI-driven noise suppression identifies and isolates your voice, removing sirens, dogs, or coffee shop chatter with surgical precision.
      </p>
      <div className="my-4 py-4 border-y border-slate-50 text-center">
        <span className="text-[10px] text-slate-300 uppercase tracking-widest">Advertisement</span>
      </div>
    </section>

    {/* Tool 4 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">4. Automated Code Assistants</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Top-down shot of a minimalist desk with a laptop writing code"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/code-assistant.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Write entire applications by describing them in plain English. These assistants predict your next line of code, fix bugs instantly, and act as a senior developer sitting right next to you.
      </p>
    </section>

    {/* Tool 5 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">5. Generative Design Engines</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Designer using a stylus on a tablet with 3D wireframes"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/design-engine.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Move from sketch to 3D model in seconds. AI-powered design tools can generate thousands of iterations based on simple constraints, optimizing weight and strength for engineering and art.
      </p>
    </section>

    {/* Tool 6 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">6. Real-time AI Translation</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Two people in a meeting with a laptop showing floating translation bubbles"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/translation.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Break language barriers instantly. Advanced neural translation allows you to host meetings with global teams, providing low-latency, accurate captions and audio dubbing as you speak.
      </p>
    </section>

    {/* Tool 7 */}
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-slate-900">7. AI-Powered File Management</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Visual metaphor of digital files organizing themselves into folders"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/file-manager.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        Never search for a document again. Semantic search tools index your entire hard drive based on meaning, not just filenames, finding that vague idea from a PDF in milliseconds.
      </p>
    </section>

    {/* Tool 8 */}
    <section className="flex flex-col gap-4 pb-12">
      <h2 className="text-2xl font-bold text-slate-900">8. Cloud Compute Accelerators</h2>
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          alt="Laptop connected to a glowing external device with fiber optic cable"
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ai-tools/cloud-compute.webp`}
          className="w-full h-auto object-cover max-h-[500px]"
          width={600}
          height={400}
        />
      </div>
      <p className="text-base text-slate-700 leading-relaxed">
        When your local hardware isnt enough, these tools seamlessly offload heavy processing to massive server farms, giving you the power of a supercomputer through a simple browser window.
      </p>
    </section>
  </div>
</main>




        </div>
 
    </>
  );
}
