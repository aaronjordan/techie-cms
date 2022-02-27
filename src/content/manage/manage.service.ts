import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BlogPost, Project, ResumeElement } from '../content.model';
import * as dto from './dto';

type anyPostDto = dto.BlogPostDto | dto.ProjectPostDto;
type anyUpdateDto = dto.BlogUpdateDto | dto.ProjectUpdateDto;

type anyDto = anyPostDto | anyUpdateDto;

@Injectable()
export class ManageService {
  constructor(
    @InjectModel('BlogPost') private readonly blogPostModel: Model<BlogPost>,
    @InjectModel('Projects') private readonly projectModel: Model<Project>,
    @InjectModel('Resume') private readonly resumeModel: Model<ResumeElement>,
  ) {}

  lookupModelForDto(data: anyDto): Model<any> {
    if (data instanceof dto.BlogPostDto || data instanceof dto.BlogUpdateDto) {
      return this.blogPostModel;
    } else if (
      data instanceof dto.ProjectPostDto ||
      data instanceof dto.ProjectUpdateDto
    ) {
      return this.projectModel;
    } else {
      throw new InternalServerErrorException();
    }
  }

  async postToCollection(data: anyPostDto) {
    if (data.isValid()) {
      const dataModel = this.lookupModelForDto(data);
      const document = new dataModel({
        ...data,
        created: new Date(),
        edited: new Date(),
      });
      await document.save();
      return true;
    } else {
      throw new BadRequestException();
    }
  }

  async updateWithinCollection(data: anyUpdateDto) {
    if (data.isValid()) {
      const dataModel = this.lookupModelForDto(data);
      const { modifiedCount } = await dataModel.updateOne(
        { _id: data.id },
        { ...data, edited: new Date() },
      );
      return modifiedCount;
    } else {
      throw new BadRequestException();
    }
  }

  async deleteById(...ids: anyUpdateDto[]) {
    // todo this could refactor to batch deletes in each category to use deleteMany when multiple specified
    const ops = ids.map((dto) =>
      this.lookupModelForDto(dto).deleteOne({ _id: dto.id }),
    );
    const res = await Promise.all(ops);
    const count = res.reduce((prev, next) => prev + next.deletedCount, 0);

    if (count === 0) {
      throw new NotFoundException();
    } else {
      return count === 1 ? 'ok' : count;
    }
  }
}
