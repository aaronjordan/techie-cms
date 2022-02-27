import { dtoPutBase } from 'src/shared/helpers';

const userManagedFieldsArr = Object.freeze([
  'username',
  'displayName',
  'image',
  'email',
]);
const userManagedFields = new Set(userManagedFieldsArr);

export interface UserAccountUpdateBody {
  username?: string;
  displayName?: string;
  image?: string;
  email?: string;
}

export class UserAccountUpdate extends dtoPutBase {
  username?: string;
  displayName?: string;
  image?: string;
  email?: string;
  fields: string[];

  constructor(edits: UserAccountUpdateBody) {
    super();
    this.fields = [];
    for (const entry in edits) {
      if (userManagedFields.has(entry)) {
        this.fields.push(entry);
        this[entry] = edits[entry]?.trim();
      }
    }
  }

  isValid() {
    return this.fields.length > 0;
  }
}
