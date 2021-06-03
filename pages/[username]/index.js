import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import {getUserWithUsername,postToJSON} from '../../lib/firebase';

//ssr. will automatically run this function on the server anytime this page is requested 
export async function getServerSideProps({query}){

    const {username}=query; //we get username from url which is given to us as query
    //fetch user doc based on username, with helper function in firebase file

    const userDoc =await getUserWithUsername(username);

     // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }


    //JSON serializable data
    let user=null;
    let posts=null;
    if (userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref
          .collection('posts')
          .where('published', '==', true)
          .orderBy('createdAt', 'desc')
          .limit(5);
          //execute the query. postToJSON convert all fields not serializable to json to a string or number
        posts = (await postsQuery.get()).docs.map(postToJSON);
      }


    return {
        props:{user,posts},
    }

}


export default function UserProfilePage({user,posts }) {
  return (
    <main>
        <UserProfile user={user} />
        <PostFeed posts={posts} />
    </main>
  )
}