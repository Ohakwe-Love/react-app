import React from "react";

const Search = ({searchTerm, setSearchTerm}) => {
    return (
        <div className="searchContainer">
            <div>
                <img src="/imgs/search.svg" alt="Search" />

                <input 
                    type="text"
                    placeholder="Search for movies, shows, or genres" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Search;