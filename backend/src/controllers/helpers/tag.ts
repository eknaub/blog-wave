import { Tag } from '../../api/models/tag';
import prisma from '../../prisma/client';

export function mapTagToDto(tag: Tag): Tag {
  return {
    id: tag.id,
    name: tag.name,
    description: tag.description,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  };
}

export async function fetchTagsByPostId(postId: number): Promise<Tag[]> {
  const fetchedTags = await prisma.postTags.findMany({
    where: { postId },
    include: { tag: true },
  });

  const tags = fetchedTags.map(pt =>
    mapTagToDto({ ...pt.tag, description: pt.tag.description ?? '' })
  );

  return tags;
}
