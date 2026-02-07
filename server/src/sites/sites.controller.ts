import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSiteDto: CreateSiteDto, @Request() req) {
    return this.sitesService.create(createSiteDto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    return this.sitesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.update(id, updateSiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }

  @Post(':id/pages')
  savePage(@Param('id') id: string, @Body() body: { components: any[] }) {
    // For simplicity, we assume one page per site initially or find the first page
    // In a real app, pageId would be a param
    return this.sitesService.findOne(id).then((site) => {
      const pageId = site.pages[0]?.id;
      if (!pageId) throw new Error('No page found for site');
      return this.sitesService.savePage(id, pageId, body.components);
    });
  }
}
