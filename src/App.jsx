import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirtsRender = useRef(true)

  useEffect(() => {
    if (isFirtsRender.current) {
      isFirtsRender.current = search === ''
      return
    }

    if(search === '') {
      setError('No se puede buscar una pelicula vacia')
      return
    }
    if (search.match(/^\d+$/)) {
      setError('No se puede buscar un numero')
      return
    }
    if (search.length < 3) {
      setError('La busqueda debe tener al menos 3 caracteres')
      return
    }
    setError(null)
    
  }, [search])
  return {search, updateSearch, error}
}

function App() { 
  const [sort, setSort] = useState(false)
  const {search, updateSearch, error} = useSearch()
  const {movies, loading, getMovies} = useMovies({search, sort})

  const debouncedGetMovies = useCallback(
    debounce(search => {
      console.log('search', search);
      getMovies({search})
    }, 500)
  , [getMovies])

  const handleSubmite = (event) => {
    event.preventDefault()
    getMovies({search})
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value;
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }


  return (
    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmite}>
          <label htmlFor="">Ingresa el nombre de la pelicula</label>
          <div className='ctn-input'>
            <input type="checkbox" onChange={handleSort} checked={sort} />
            <input onChange={handleChange} value={search} name='query' type="text" placeholder='Avenger, Star Wars, Matrix...' />
            <button type='submit'>Buscar</button>
          </div>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </header>
      <main>
        {loading ? <p>Cargando...</p> : <Movies movies={movies} />}
        </main>
    </div>
  )
}

export default App
