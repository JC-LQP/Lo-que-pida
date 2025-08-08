import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FirebaseUser {
  uid: string;
  email?: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
  role?: string;
  customClaims?: Record<string, any>;
}

@Injectable()
export class FirebaseAuthService {
  private readonly logger = new Logger(FirebaseAuthService.name);

  constructor(private configService: ConfigService) {
    this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    try {
      // Check if Firebase Admin is already initialized
      if (admin.apps.length === 0) {
        const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
        const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');
        const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');

        if (!projectId || !privateKey || !clientEmail) {
          throw new Error('Firebase Admin credentials are missing in environment variables');
        }

        // Parse the private key (handle escaped newlines)
        const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            privateKey: formattedPrivateKey,
            clientEmail,
          }),
        });

        this.logger.log('Firebase Admin initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin:', error);
      throw error;
    }
  }

  async verifyIdToken(idToken: string): Promise<FirebaseUser> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      const user: FirebaseUser = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified || false,
        name: decodedToken.name,
        picture: decodedToken.picture,
        customClaims: decodedToken,
      };

      // Extract role from custom claims if available
      if (decodedToken.role) {
        user.role = decodedToken.role;
      } else {
        // Default role assignment logic
        user.role = 'CUSTOMER';
      }

      this.logger.log(`User authenticated: ${user.uid}`);
      return user;
    } catch (error) {
      this.logger.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUserById(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await admin.auth().getUser(uid);
    } catch (error) {
      this.logger.error(`Failed to get user by ID ${uid}:`, error.message);
      throw new UnauthorizedException('User not found');
    }
  }

  async setCustomUserClaims(uid: string, claims: Record<string, any>): Promise<void> {
    try {
      await admin.auth().setCustomUserClaims(uid, claims);
      this.logger.log(`Custom claims set for user: ${uid}`);
    } catch (error) {
      this.logger.error(`Failed to set custom claims for user ${uid}:`, error.message);
      throw error;
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    displayName?: string;
    emailVerified?: boolean;
  }): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await admin.auth().createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.displayName,
        emailVerified: userData.emailVerified || false,
      });

      this.logger.log(`User created: ${userRecord.uid}`);
      return userRecord;
    } catch (error) {
      this.logger.error('Failed to create user:', error.message);
      throw error;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      await admin.auth().deleteUser(uid);
      this.logger.log(`User deleted: ${uid}`);
    } catch (error) {
      this.logger.error(`Failed to delete user ${uid}:`, error.message);
      throw error;
    }
  }

  async updateUser(uid: string, properties: admin.auth.UpdateRequest): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await admin.auth().updateUser(uid, properties);
      this.logger.log(`User updated: ${uid}`);
      return userRecord;
    } catch (error) {
      this.logger.error(`Failed to update user ${uid}:`, error.message);
      throw error;
    }
  }
}
