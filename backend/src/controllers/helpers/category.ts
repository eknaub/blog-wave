import { Category, CategoryDetails } from '../../api/models/category';
import prisma from '../../prisma/client';

type FetchedCategory = {
  category: {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
} & {
  postId: number;
  categoryId: number;
};

export function mapCategoryToDto(category: Category): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export function mapCategoryToDetailDto(category: Category): CategoryDetails {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
  };
}

export async function fetchCategoriesByPostId(
  postId: number
): Promise<Category[]> {
  const fetchedCategories: FetchedCategory[] =
    await prisma.postCategory.findMany({
      where: { postId },
      include: { category: true },
    });

  const categories = fetchedCategories.map(pc =>
    mapCategoryToDto({
      ...pc.category,
      description: pc.category.description ?? '',
    })
  );

  return categories;
}
