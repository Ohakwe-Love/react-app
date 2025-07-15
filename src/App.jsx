import React, { useState } from 'react'
import Search from './components/search';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('Kingdom of Heaven');
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
          <h1>The Best <span>Streaming</span> Experience</h1>
          <p>
            StreamVibe is the best streaming experience for watching your favorite movies and shows on demand, anytime, anywhere. With StreamVibe, you can enjoy a wide variety of content, including the latest blockbusters, classic movies, popular TV shows, and more. You can also create your own watchlists, so you can easily find the content you want to watch.
          </p>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          {/* <h1>{searchTerm}</h1> */}
        </div>
      </section>
    </main>
  )
}

export default App