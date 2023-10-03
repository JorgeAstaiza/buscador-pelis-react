import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { searchMovies } from "../services/movies"


export function useMovies({search, sort}) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // useRef para guardar la valor de la busqueda anterior
  const prevSearch = useRef(search)

  const getMovies = useCallback(async ({search}) => {
    if(search === prevSearch.current) return

    try {
      setLoading(true)
      setError(null)
      prevSearch.current = search
      const newMovies = await searchMovies({search})
      setMovies(newMovies)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])
    const sortedMovies = useMemo(() => {
      return sort 
        ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) : 
        movies
    }, [movies, sort])
  
    return {movies: sortedMovies, getMovies, loading, error}
  }