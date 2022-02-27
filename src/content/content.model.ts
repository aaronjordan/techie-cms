import * as mongoose from 'mongoose';

export const BlogPostSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  created: Date,
  edited: Date,
});

export interface BlogPost extends mongoose.Document {
  title: string;
  body: string;
  tags: string[];
  created: Date;
  edited: Date;
}

export const ProjectSchema = new mongoose.Schema({
  title: String,
  startDate: Date,
  releaseDate: Date,
  images: [String],
  body: String,
  link: String,
  source: String,
  file: String,
});

export interface Project extends mongoose.Document {
  title: string;
  startDate: Date;
  releaseDate: Date;
  images: string[];
  body: string;
  link: string;
  source: string;
  file: string;
}

export interface PaginationDetails {
  page: number;
  size?: number;
  sort?: string;
}

export type ResumeElementCategory =
  | 'experience'
  | 'education'
  | 'awards'
  | 'objective'
  | 'contactInfo'
  | 'skills';

export const ResumeElementSchema = new mongoose.Schema({
  headline: String,
  location: String,
  duration: {
    start: Date,
    end: Date,
  },
  category: String,
  body: String,
  roleTitle: String,
  gpa: Number,
  links: [String],
  sequenceNumber: Number,
});

export interface ResumeElement extends mongoose.Document {
  headline: string;
  location: string;
  duration: {
    start: Date;
    end: Date;
  };
  category: ResumeElementCategory;
  body: string;
  roleTitle: string;
  gpa: number;
  links: string[];
  sequnceNumber: number;
}
