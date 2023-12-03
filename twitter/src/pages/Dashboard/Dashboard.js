import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import NavBar from "../../components/NavBar/NavBar";
import Home from "../../components/Home/Home";
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import RandomUsers from "../../components/RandomUsers/RandomUsers";

const Dashboard = () => {
  
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => !!state.auth.fetchAuth);
  const user = useSelector((state) => state.auth.fetchAuth);
  
  const comments = useSelector((state) => state.comments.comments);
  const tweets = useSelector((state) => state.tweets.tweets);
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const [homeKey, setHomeKey] = useState(0); // Un état qui déclenchera la mise à jour du composant Home

  const handleHomeClick = () => {
    setHomeKey((prevKey) => prevKey + 1);
  }; 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]); 

  if (!isAuthenticated) {
    return null;
  }
  const filteredTweets = searchTerm
  ? tweets.filter(
      (tweet) =>
        tweet.TweetContent &&
        tweet.TweetContent.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : tweets;

  

  return (
    <div className="flex">
      <div className="w-1/5">
        
        <NavBar onHomeClick={handleHomeClick}/>
      </div>
      <div className="w-1/2 m-10">
        <Home user={user} filteredTweets={filteredTweets} key={homeKey}   />
      </div>

    {/* 3e section */}
      <div className="w-1/5 mt-24 fixed right-16">
  <div className="relative">
    <input
      type="text"
      placeholder="Search"
      className="w-full border p-2 rounded-full mb-4 pl-8 bg-blue-50 border hover:border-gray-300 focus:border-blue-500 focus:outline-none	"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-3 left-2 text-gray-500" />
  </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 mt-9">Discover Users</h3>
          <RandomUsers/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
