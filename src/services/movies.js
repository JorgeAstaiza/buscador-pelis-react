const API_KEY = '4287ad07'

export const searchMovies = async ({search}) => {
    console.log(search);
    if (search === '') return null
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const json = await response.json()
        const movies = json.Search
        return movies?.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster
          }))
    } catch (error) {
        throw new Error(error, 'Error fetching movies')
    }
}