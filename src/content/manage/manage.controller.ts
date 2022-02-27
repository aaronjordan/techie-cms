import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { isNonEmptyString } from 'src/shared/helpers';
import { StrictLocJwtAuthGuard } from 'src/user/auth/jwt.strategy';
import { MinRole, RoleGuard, Roles } from 'src/user/role.guard';

import {
  BlogPostDto,
  BlogUpdateDto,
  ProjectPostDto,
  ProjectPostBody,
  ProjectUpdateDto,
  ProjectPutBody,
} from './dto';
import { ManageService } from './manage.service';

const slugs = {
  blog: 'blog',
  projects: 'projects',
};

@MinRole(Roles.EDITOR)
@UseGuards(StrictLocJwtAuthGuard, RoleGuard)
@Controller()
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  @Post(slugs.blog)
  async postBlog(@Body() rawData: BlogPostDto) {
    const { title, body, tags } = rawData;
    const instance = new BlogPostDto(title, body, tags);
    await this.manageService.postToCollection(instance);
    return 'ok';
  }

  @Put(slugs.blog)
  async putBlog(@Body() rawData: BlogUpdateDto) {
    const { id } = rawData;
    delete rawData.id;
    const instance = new BlogUpdateDto(id, { ...rawData });
    const c = await this.manageService.updateWithinCollection(instance);
    return c === 1;
  }

  @Delete(slugs.blog)
  async deleteBlog(@Body() post: { id: string | string[] }) {
    const { id } = post;
    if (Array.isArray(id)) {
      return await this.manageService.deleteById(
        ...id.map((i) => new BlogUpdateDto(i)),
      );
    } else if (isNonEmptyString(id)) {
      return await this.manageService.deleteById(new BlogUpdateDto(id));
    } else {
      throw new BadRequestException();
    }
  }

  @Post(slugs.projects)
  async postProject(@Body() rawData: ProjectPostBody) {
    const instance = new ProjectPostDto(rawData);
    await this.manageService.postToCollection(instance);
    return 'ok';
  }

  @Put(slugs.projects)
  async putProject(@Body() rawData: ProjectPutBody) {
    const { id } = rawData;
    delete rawData.id;
    const instance = new ProjectUpdateDto(id, { ...rawData });
    const c = await this.manageService.updateWithinCollection(instance);
    return c === 1;
  }

  @Delete(slugs.projects)
  async deleteProject(@Body() post: { id: string | string[] }) {
    const { id } = post;
    if (Array.isArray(id)) {
      return await this.manageService.deleteById(
        ...id.map((x) => new ProjectUpdateDto(x)),
      );
    } else if (isNonEmptyString(id)) {
      return await this.manageService.deleteById(new ProjectUpdateDto(id));
    } else {
      throw new BadRequestException();
    }
  }
}
