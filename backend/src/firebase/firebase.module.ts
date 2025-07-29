import { Module, Global } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Ruta absoluta al archivo JSON (dentro de src/)
const serviceAccountPath = path.join(__dirname, '..', '..', 'firebase', 'firebase.serviceAccountKey.json');

// Leer y parsear el archivo como JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, 'utf8')
);

@Global()
@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class FirebaseModule {}
