export interface ArticleType extends Tables<"articles"> {
   category: string 
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