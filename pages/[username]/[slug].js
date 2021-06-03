
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import HeartButton from '../../components/HeartButton';
import Link from 'next/link';
import AuthCheck from '../../components/AuthCheck';
//good for caching with cdn
//tell next to fetch data on server at build time to pre-render
export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  console.log('in getstaticprops of username/slug');
  console.log(userDoc);

  //if username exists
  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());
        //save to path so later easier to hydrate
    path = postRef.path;
  }

  //revalidate tells next to regenerate this page on server when new request come in, but only do so in certain time interval
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

//to tell next which page to render as they are all rendered in advance so NEXT dunno which id or slug to render
export async function getStaticPaths() {
  // Improve by using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });
  //as we are using dynamic data, how next know to re-run if we create new posts to database?
//blocking will let next to fallback to regular ssr if navigate to page and prerendered page does not exist, then once rendered, cache under cdn
  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}


///hydrate to real-time data feed
export default function Post(props) {
    const postRef = firestore.doc(props.path);
    const [realtimePost] = useDocumentData(postRef);
  
    //if real time data not ready , we fall back on props.post
    const post = realtimePost || props.post;
  
    return (
      <main className={styles.container}>
  
        <section>
     
          <PostContent post={post} />
        </section>
  
        <aside className="card">
          <p>
            <strong>{post.heartCount || 0} 🤍</strong>
          </p>
          <AuthCheck
          fallback={
            <Link href="/enter">
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
  
        </aside>
      </main>
    );
  }
  