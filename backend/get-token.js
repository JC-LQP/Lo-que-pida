// get-token.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCsgeWc6Bpxd6gmm-hpVWmbYWAwlNaQS-8',
  authDomain: 'loquepida-d1366.firebaseapp.com',
  projectId: 'loquepida-d1366',
};

const email = 'admin@loquepida.com';
const password = 'admin123';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => userCredential.user.getIdToken())
  .then((token) => {
    console.log('\nTOKEN:\n');
    console.log(token);
  })
  .catch((error) => {
    console.error('Error:', error.code, error.message);
  });
