import logo from './logo.svg';
import './App.css';
import {Fragment,useState} from 'react'


const blogInfo = {
   nPosts: 200,
   nFollower: 400,
   nFollow: 600,
  };
  
  function BlogInfo() {
    let [info, setInfo] = useState(blogInfo);
    return (
      <div className="info-container">
        <div className="info-list">게시물:{info.nPosts}</div>
        <div className="info-list">팔로워:{info.nFollower}</div>
        <div className="info-list">팔로우:{info.nFollow}</div>
        <i
        onClick={()=>{
          setInfo({...info, nFollow: info.nFollow + 1});
        }
        }>💖다른 사용자 팔로우❤</i>
      </div>
    );
  }
  
function Paging() {
  let [pageNum, setPageNum] = useState(1);
  return (
    <div>
      <button
        onClick={() => {
          setPageNum(pageNum - 1);
          setPageNum(pageNum - 1);
          console.log(pageNum);
        }}
      >
        ◀
      </button>
      {pageNum}
      <button
        onClick={() => {
          setPageNum((prevState) => prevState + 1);
          setPageNum((prevState) => prevState + 1);
          console.log(pageNum);
        }}
      >
        ▶
      </button>
    </div>
  );
}

const post1 = {
  postId: 1,
  title: "happy holiday",
  writer: "kim",
  year: 2023,
  month: 5,
  likes: 5,
};
const post2 = {
  postId: 2,
  title: "happy festival",
  writer: "kim",
  year: 2023,
  month: 4,
  likes: 10,
};

function App() {

  let [post, setPost] = useState([post1, post2]);

  return (
    <div className="post-container">
      <BlogInfo></BlogInfo>
      <div className="post-list">
        <h2>Title: {post[0].title}</h2>
        <p>Writer : {post[0].writer}</p>
        <p>
          date: {post[0].month}. {post[0].year}
        </p>
        <p>
          Like:{post[0].likes}
          <i
            onClick={() => {
              let modiPost = post.map((p) =>
                p.postId === 1 ? { ...p, likes: p.likes + 1 } : p
              );
              setPost(modiPost);
            }}
          >
            👍
          </i>

        </p>
      </div>

      <div className="post-list">
        <h2>Title: {post[1].title}</h2>
        <p>Writer : {post[1].writer}</p>
        <p>
          date: {post[1].month}. {post[1].year}
        </p>
        <p
          onClick={function () {

          }}
        >
          Like:{post[1].likes}
          <i
            onClick={() => {
              let modiPost = post.map((p) =>
                p.postId === 2 ? { ...p, likes: p.likes + 1 } : p
              );
              setPost(modiPost);
            }}
          >
            👍
          </i>
        </p>
      </div>
      <Paging></Paging>
    </div>
  );
}


export default App;
