import React, { use, useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';


const API_BASE_URL = 'https://api.themoviedb.org/3'; 
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; 
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', 
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const bannedKeywords = ['sex', 'porn', 'xxx', 'adult', 'erotic', 'nsfw'];


  const fetchMovies = async (query = '') => {
    // Check for banned keywords
    if (
      query &&
      bannedKeywords.some(word =>
        query.toLowerCase().includes(word)
      )
    ) {
      setErrorMessage('Serch term contains banned keywords');
      setMovies([]);
      return;
    }
      setLoading(true);
    setErrorMessage('');

    try {
      const endPoint =  query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
    
      const response = await fetch(endPoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies, Please try again later');
        setMovies([]);
        return;
      }

      setMovies(data.results || []);

    }catch (error) {
      console.error(`Error fetching movies, Please try again later`);
      setErrorMessage('Failed to fetch movies, Please try again later');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm);  
  }, [searchTerm]);

  return (
    <main className='mainContainer'>
      <section className="heroContainer">
        <header>
          <a href="" className='logo'>
            <img src="/imgs/logo/Logo.svg" alt="Logo" />
          </a>

          <nav>
            <ul>
              <li><a href="">home</a></li>
              <li><a href="">Movies & Shows</a></li>
              <li><a href="">Support</a></li>
              <li><a href="">Subscriptions</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            <span className="notifications">
              <img src="/imgs/notification.svg" alt="" />
            </span>
          </div>
        </header>

        <div className="hero">
          <div className="heroImage">
            <img src="/imgs/abstract.svg" alt="Hero Image" />
          </div>
          <h1>The <span>Best Streaming</span> Experience</h1>
          <p>
            StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
          </p>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          {/* <h1>{searchTerm}</h1> */}
        </div>
      </section>

      <section className="allMovies">
        <h2>All Movies</h2>
        {/* {errorMessage && <div className='errorMessage'>{errorMessage}</div>} */}

        { 
          loading ? (
            <div className='loading-spinner'>
              <Spinner />
            </div>
          ) : errorMessage ? (
            <div className='errorMessage'>{errorMessage}</div>
          ) : (
            <div className='moviesContainer'>
              {
                movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              }
            </div>
          )
        }

      </section>
    </main>
  )
}

export default App