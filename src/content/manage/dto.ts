import { dtoPutBase, isNonEmptyString } from 'src/shared/helpers';

export class BlogPostDto {
  title: string;
  body: string;
  tags: string[] | [];

  constructor(title: string, body: string, tags: string[] | []) {
    this.title = title;
    this.body = body;
    this.tags = tags;
  }

  isValid() {
    return (
      this.title?.length > 0 &&
      this.body?.length > 0 &&
      Array.isArray(this.tags)
    );
  }
}

export class BlogUpdateDto extends dtoPutBase {
  id: string;
  title?: string;
  body?: string;
  tags?: string[] | [];

  constructor(
    id: string,
    edits?: { title?: string; body?: string; tags?: string[] },
  ) {
    super();
    Object.defineProperty(this, 'id', { value: id, enumerable: false });
    if (edits)
      for (const key in edits) {
        this[key] = edits[key];
      }
  }

  isValid() {
    return (
      isNonEmptyString(this.id) &&
      (this.omits('title') || typeof this.title === 'string') &&
      (this.omits('body') || typeof this.body === 'string') &&
      (this.omits('tags') || Array.isArray(this.tags))
    );
  }
}

export type ProjectPostBody = {
  title: string;
  startDate: number;
  releaseDate: number;
  images: string[] | [];
  body: string;
  link: string;
  source: string;
  file: string;
};

export class ProjectPostDto {
  title: string;
  startDate: Date;
  releaseDate: Date;
  images: string[] | [];
  body: string;
  link: string;
  source: string;
  file: string;

  constructor(rawData: ProjectPostBody) {
    for (const key in rawData) {
      if (key === 'startDate' || key === 'releaseDate') {
        if (isNaN(rawData[key])) throw Error('invalid date object in project');
        this[key] = new Date(Number(rawData[key])); // take in as epochMS
      } else {
        this[key] = rawData[key];
      }
    }
  }

  isValid() {
    return (
      isNonEmptyString(this.title) &&
      isNonEmptyString(this.body) &&
      this.startDate instanceof Date &&
      this.releaseDate instanceof Date &&
      Array.isArray(this.images) &&
      typeof this.link === 'string' &&
      typeof this.source === 'string' &&
      typeof this.file === 'string'
    );
  }
}

export type ProjectPutBody = {
  id: string;
  title?: string;
  startDate?: number;
  releaseDate?: number;
  images?: string[] | [];
  body?: string;
  link?: string;
  source?: string;
  file?: string;
};

export class ProjectUpdateDto extends dtoPutBase {
  id: string;
  title?: string;
  startDate?: Date;
  releaseDate?: Date;
  images?: string[] | [];
  body?: string;
  link?: string;
  source?: string;
  file?: string;

  constructor(id: string, edits?: ProjectPutBody) {
    super();
    Object.defineProperty(this, 'id', { value: id, enumerable: false });
    if (edits)
      for (const key in edits) {
        if (key === 'startDate' || key === 'releaseDate') {
          if (isNaN(edits[key])) throw Error('invalid date object in project');
          this[key] = new Date(Number(edits[key])); // take in as epochMS
        } else {
          this[key] = edits[key];
        }
      }
  }

  isValid() {
    return (
      isNonEmptyString(this.id) &&
      (this.omits('title') || isNonEmptyString(this.title)) &&
      (this.omits('body') || isNonEmptyString(this.body)) &&
      (this.omits('startDate') || this.startDate instanceof Date) &&
      (this.omits('releaseDate') || this.releaseDate instanceof Date) &&
      (this.omits('images') || Array.isArray(this.images)) &&
      (this.omits('link') || typeof this.link === 'string') &&
      (this.omits('source') || typeof this.source === 'string') &&
      (this.omits('file') || typeof this.file === 'string')
    );
  }
}
