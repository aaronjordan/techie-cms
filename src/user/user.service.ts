import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import {
  validateEmail,
  validateIsProfileURL,
  validateImageContentType,
} from 'src/shared/helpers';
import { NewUserRequestData, PasswordResetData } from './auth/auth.model';
import { UserAccountUpdate } from './user.dto';
import { UserAccount, UserIdentifier, UserInfo } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('UserAccount')
    private readonly userAccount: Model<UserAccount>,
  ) {}

  async findUserById(id: string): Promise<UserAccount> {
    const user = (await this.userAccount.findById(id)) || undefined;
    if (!user) {
      throw new NotFoundException('No user with this UserID was found.');
    }
    return user;
  }

  async findUser(usernameOrEmail: string): Promise<UserAccount | undefined> {
    const user = await this.userAccount
      .findOne()
      .or([{ username: usernameOrEmail }, { email: usernameOrEmail }]);
    return user || undefined;
  }

  async logUserSeen(identifier: UserIdentifier): Promise<boolean> {
    let user = null;

    if (identifier instanceof Document) {
      user = identifier;
    } else if ('id' in identifier) {
      user = await this.findUserById(identifier.id);
    } else {
      const { username = '', email = '' } = identifier as any;
      user = await this.findUser(username || email);
    }

    if (user) {
      user.lastSeen = new Date();
      await user.save();
      return true;
    } else {
      return false;
    }
  }

  async validateUnique(
    type: keyof UserAccount,
    value: string,
  ): Promise<boolean> {
    const existingUser = await this.userAccount.findOne({ [type]: value });
    return !existingUser;
  }

  async validateNewUsername(username: string) {
    const usernameRegex = /^[A-Za-z0-9]{3,24}$/;
    const isLegal = usernameRegex.test(username);
    const isUnique = this.validateUnique('username', username);
    return (await isUnique) && isLegal;
  }

  async validateNewEmail(email: string) {
    const isLegal = validateEmail(email);
    const isUnique = this.validateUnique('email', email);
    return (await isUnique) && isLegal;
  }

  // leaving this very open - any string char should be okay here.
  validateDisplayName(name: string) {
    return name.length <= 80;
  }

  async createNewUser(formData: NewUserRequestData): Promise<string> {
    const doc = new this.userAccount({
      email: formData.email,
      username: formData.username,
      key: formData.password, // is hashed by AuthService
      deadKeys: [],
      role: 'V',
      displayName: '',
      image: '',
      created: new Date(),
      lastSeen: new Date(),
    });
    return (await doc.save()).id;
  }

  /**
   * Updates a user's password, will validate the previous password entry if provided.
   * Adds the current password hash to the user's list of dead passwords.
   * @param formData Should be hashed password strings where in use
   */
  async changePassword(systemData: PasswordResetData) {
    const { id, password } = systemData;
    if (!id || !password) throw new BadRequestException();

    const user = await this.findUserById(id);
    user.deadKeys.push(user.key);
    user.key = password;
    await user.save();

    return true;
  }

  async getSelfProfile(id: string, username: string): Promise<UserInfo> {
    const data = await this.findUserById(id);
    if (data.username !== username) {
      throw new UnauthorizedException();
    } else {
      return {
        username: data.username,
        displayName: data.displayName,
        image: data.image,
        role: data.role,
        email: data.email,
        created: data.created,
      };
    }
  }

  /**
   * Updates the user with given id given a set of updates
   * @param id the id of the user to update
   * @param update the changes to apply to this user
   * @returns an array of names of the keys which were successfully changed
   */
  async updateUserData(id: string, update: UserAccountUpdate) {
    const changes = [];
    const user = await this.findUserById(id);

    for (const field of update.fields) {
      switch (field) {
        case 'username':
          if (!(await this.validateNewUsername(update[field]))) continue;
          break;
        case 'email':
          if (!(await this.validateNewEmail(update[field]))) continue;
          break;
        case 'displayName':
          if (!this.validateDisplayName(update[field])) continue;
          break;
        case 'image':
          console.log('handle image');
          if (!validateIsProfileURL(update[field])) continue;
          if (
            update[field] !== '' &&
            !(await validateImageContentType(update[field]))
          ) {
            continue;
          }
          break;
      }

      user[field] = update[field];
      changes.push(field);
    }

    if (changes.length) await user.save();
    return changes;
  }
}
