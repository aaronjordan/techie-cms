import * as mongoose from 'mongoose';
import { UserRole } from './role.guard';

export const UserAccountSchema = new mongoose.Schema({
  username: String,
  key: String,
  deadKeys: [String],
  role: String,
  email: String,
  displayName: String,
  image: String,
  created: Date,
  lastSeen: Date,
});

export interface UserAccount extends mongoose.Document {
  username: string;
  key: string;
  deadKeys: string[];
  role: UserRole;
  email: string;
  displayName: string;
  image: string;
  created: Date;
  lastSeen: Date;
}

export interface UserInfo {
  username: string;
  displayName: string;
  image: string;
  role?: UserRole;
  email?: string;
  created?: Date;
}

export type UserIdentifier =
  | UserAccount
  | {
      username: string;
    }
  | {
      id: string;
    }
  | {
      email: string;
    };
