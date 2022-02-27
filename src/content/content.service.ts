import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

import {
  BlogPost,
  PaginationDetails,
  Project,
  ResumeElement,
} from './content.model';

const DEFAULT_PAGE_SIZE = 10;
const SORT_OPTIONS = {
  RECENTLY_POSTED: { created: -1 },
  RECENTLY_UPDATED: { updated: -1 },
  SEQUENCE_NUMBER: { sequence: 1 },
};

@Injectable()
export class ContentService {
  constructor(
    @InjectModel('BlogPost') private readonly blogPostModel: Model<BlogPost>,
    @InjectModel('Projects') private readonly projectModel: Model<Project>,
    @InjectModel('Resume') private readonly resumeModel: Model<ResumeElement>,
  ) {}

  parseSort(sort?: string) {
    return sort in SORT_OPTIONS
      ? SORT_OPTIONS[sort]
      : SORT_OPTIONS.RECENTLY_POSTED;
  }

  async readAllContentFromCollection(model: Model<Document>, sort?: string) {
    const selectedSort = this.parseSort(sort);
    const posts = await model.find().sort(selectedSort).exec();
    return posts;
  }

  async readContentFromCollectionByPage(
    model: Model<Document>,
    pagination: PaginationDetails,
  ) {
    const { page, size = DEFAULT_PAGE_SIZE, sort } = pagination;
    const selectedSort = this.parseSort(sort);
    const posts = await model
      .find()
      .sort(selectedSort)
      .skip(Math.max((page - 1) * size, 0))
      .limit(size)
      .exec();
    return posts;
  }

  getAllBlogPosts = async (sort = '') =>
    await this.readAllContentFromCollection(this.blogPostModel, sort);

  getBlogPostsByPage = async (page: number, size: number, sort = '') =>
    await this.readContentFromCollectionByPage(this.blogPostModel, {
      page,
      size,
      sort,
    });

  getAllProjects = async (sort = '') =>
    await this.readAllContentFromCollection(this.projectModel, sort);

  getProjectsByPage = async (page: number, size: number, sort = '') =>
    await this.readContentFromCollectionByPage(this.projectModel, {
      page,
      size,
      sort,
    });

  getResumeElements = async () =>
    await this.readAllContentFromCollection(
      this.resumeModel,
      'SEQUENCE_NUMBER',
    );
}
