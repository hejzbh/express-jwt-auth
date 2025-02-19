import { axiosInstance } from "../../lib/axios";

const HomePage = () => {
  async function getPosts() {
    axiosInstance
      .get(`${process.env.REACT_APP_API_KEY!}/posts`)
      .then(console.log)
      .catch(console.error);
  }

  return (
    <div>
      Welcome to homepage <button onClick={getPosts}>Fetch posts</button>
    </div>
  );
};

export default HomePage;
