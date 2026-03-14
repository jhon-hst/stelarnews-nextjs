export interface ArticleType {
  id: number;
  title: string;
  category: string;
  categoryId: number;
  image: string;
}

export interface ArticleSectionType {
  id: number;
  title: string;
  image: string;
  description: string;
}

export interface ArticleDetailType {
  id: number;
  slug: string;
  title: string;
  image: string;
  description: string;
  sections: ArticleSection[];
}