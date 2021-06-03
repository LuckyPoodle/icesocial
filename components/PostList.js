

import PostFeed from './PostFeed';

import { firestore, auth } from '../lib/firebase';



import { useCollection } from 'react-firebase-hooks/firestore';


export default function PostList() {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
    const query = ref.orderBy('createdAt');
    const [querySnapshot] = useCollection(query);
  
    const posts = querySnapshot?.docs.map((doc) => doc.data());
  
    return (
      <>
        <h1>Manage your Posts</h1>
        <PostFeed posts={posts} admin />
      </>
    );
  }