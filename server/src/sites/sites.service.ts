import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  create(createSiteDto: CreateSiteDto, userId: string) {
    return this.prisma.site.create({
      data: {
        ...createSiteDto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.site.findMany({ where: { userId } });
  }

  findOne(id: string) {
    return this.prisma.site.findUnique({
      where: { id },
      include: { pages: { include: { components: true } } },
    });
  }

  update(id: string, updateSiteDto: UpdateSiteDto) {
    return this.prisma.site.update({
      where: { id },
      data: updateSiteDto,
    });
  }

  remove(id: string) {
    return this.prisma.site.delete({ where: { id } });
  }

  async savePage(siteId: string, pageId: string, components: any[]) {
    // Transaction to replace all components
    return this.prisma.$transaction(async (tx) => {
      // 1. Delete existing components for this page
      await tx.component.deleteMany({ where: { pageId } });

      // 2. Create new components
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const created = await Promise.all(
        components.map((comp, index) =>
          tx.component.create({
            data: {
              pageId,
              type: comp.type,
              properties: comp.properties,
              order: index,
            },
          }),
        ),
      );
      return created;
    });
  }
}
