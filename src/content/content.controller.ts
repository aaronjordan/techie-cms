import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PaginationDetails } from './content.model';
import { ContentService } from './content.service';

@Controller()
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('blog')
  async blog(@Query() query: PaginationDetails) {
    const { page, size, sort = '' } = query;
    if (page < 1) {
      throw new BadRequestException();
    } else if (page) {
      return await this.contentService.getBlogPostsByPage(page, size, sort);
    }
    return await this.contentService.getAllBlogPosts(sort);
  }

  @Get('projects')
  async projects(@Query() query: PaginationDetails) {
    const { page, size, sort = '' } = query;
    if (page < 1) {
      throw new BadRequestException();
    } else if (page) {
      return await this.contentService.getProjectsByPage(page, size, sort);
    }
    return await this.contentService.getAllProjects(sort);
  }

  @Get('resume')
  async resume() {
    return await this.contentService.getResumeElements();
  }
}
