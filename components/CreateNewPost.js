import styles from '../styles/Admin.module.css';

import { UserContext } from '../lib/context';
import { firestore, auth, serverTimestamp } from '../lib/firebase';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';


export default function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');
  
    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));
  
    // Validate length
    const isValid = title.length > 3 && title.length < 100;
  
    // Create a new post in firestore
    const createPost = async (e) => {
      e.preventDefault();
      const uid = auth.currentUser.uid;
      //we make ref to doc(slug) which doesnt exist yet as we dun want the id to be randomly generated
      const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);
  
      // Tip: give all fields a default value here
      const data = {
        title,
        slug,
        uid,
        username,
        published: false,
        content: '# hello world!',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        heartCount: 0,
      };
  
      await ref.set(data);
  
      toast.success('Post created!')
  
      // Imperative navigation after doc is set
      router.push(`/admin/${slug}`);
  
    };
  
    return (
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
          className={styles.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </form>
    );
  }