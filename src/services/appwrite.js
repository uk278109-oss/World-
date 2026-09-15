import { Client, Account, Databases } from 'appwrite'
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  WORLD_DATABASE_ID,
  MOMENT_TABLE_ID,
  PROFILES_TABLE_ID
} from '../config/appwrite'

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)

export const config = {
  databaseId: WORLD_DATABASE_ID,
  momentTableId: MOMENT_TABLE_ID,
  profilesTableId: PROFILES_TABLE_ID
}

export async function getCurrentUser() {
  try { return await account.get() } catch { return null }
      }
