import React from 'react'

const MovieCard = ({movie: {poster_path, release_date, title, vote_average, original_language}}) => {
  return (
    <div className='movie-card'>
        {poster_path ? (
            <a href='' className="movieImg">
                <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />
            </a>
        ) : ( 
            <a href='' className="noImage">
                <img src="/imgs/abstract.svg" alt={title} />
            </a>
        )}

        <div className='movie-info mt-4'>
            <h3 className='movie-title'>{title}</h3>  

            <div className="movieDetails">
                <div className="rating">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#FFD700"
                        viewBox="0 0 24 24"
                        style={{ verticalAlign: 'middle', marginRight: '4px' }}
                        >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span className=''>{vote_average ? vote_average.toFixed(1) : 'N/A'}</span>    
                </div>  

                <span>•</span>         
                
                <p className='language'>{original_language.toUpperCase()}</p>

                <span>•</span>         

                <p className='release-date'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>       
            </div>
        </div>
    </div>
  )
}

export default MovieCard