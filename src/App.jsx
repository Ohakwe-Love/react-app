import React, { use, useEffect, useState } from 'react'
import { useDebounce } from 'react-use';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { updateSearchCount, getTrendingMovies } from './appwrite';


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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [movies, setMovies] = useState([]); 
  const [errorMessage, setErrorMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState('');
  // const [screen, setScreen] = useState('')

  // Debounce the search term to avoid too many API calls
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 1000, [searchTerm]);

  const bannedKeywords = ['sex', 'porn', 'xxx', 'adult', 'erotic', 'nsfw'];

  const fetchMovies = async (query = '') => {
    // Check for banned keywords
    if (
      query &&
      bannedKeywords.some(word =>
        query.toLowerCase().includes(word)
      )
    ) {
      setErrorMessage('Search term contains banned keywords');
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
      
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    }catch (error) {
      console.error(`Error fetching movies, Please try again later`);
      setErrorMessage('Failed to fetch movies, Please try again later');
    } finally {
      setLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);  
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies()
  }, [])

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

            <div className="toggleMenu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </div>
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

      {/* trending movies */}
      {
        trendingMovies.length > 0 && (
          <section className="trendingMovies">
            <h2>Trending</h2> 

            <div className='trendingMovieRow'>
              {
                trendingMovies.map((movie, index) => (
                  <div key={movie.$id} className='trendingMovieCard'>

                    <div className='movieCount'>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                      <defs>
                        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stop-color="#E50000"/>
                          <stop offset="50%" stop-color="#ef4444"/>
                          <stop offset="100%" stop-color="#fae1ff"/>
                        </linearGradient>
                      </defs>
                      <text x="50%" y="50%" textAnchor="middle" dy=".35em"
                        fontSize="150px" fontWeight="900" fill="none"
                        stroke="url(#strokeGradient)" strokeWidth="4">
                        {index + 1}
                      </text>
                    </svg>
                    </div>

                    <div className='trendingMovieImg'>
                      { movie.poster_url ? (
                        <img src={movie.poster_url} alt={movie.searchTerm}  className=''/>
                      ) : (
                        <div className='trendingNoImage'>
                          <img src="/imgs/abstract.svg" alt={movie.searchTerm}  />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          </section>
        )
      }

      {/* all movies */}
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