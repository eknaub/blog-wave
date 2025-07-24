import { Category } from '../../api/models/category';
import prisma from '../../prisma/client';

export function mapCategoryToDto(category: Category): Category {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
}

export async function fetchCategoriesByPostId(
  postId: number
): Promise<Category[]> {
  const fetchedCategories = await prisma.postCategory.findMany({
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
