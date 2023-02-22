// useEffect: HTTP requests
// 💯 store the state in an object
// http://localhost:3000/isolated/final/06.extra-3.js

import * as React from 'react'
import {
    fetchPokemon,
    PokemonInfoFallback,
    PokemonForm,
    PokemonDataView,
} from '../pokemon'

import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'

function PokemonInfo({pokemonName, setPokemonName}) {
    const [state, setState] = React.useState({
        status: 'idle',
        pokemon: null,
        error: null,
    })
    const {status, pokemon, error} = state
    const handleError = useErrorHandler()

    React.useEffect(() => {
        if (!pokemonName) {
            return
        }
        setState({status: 'pending'})
        fetchPokemon(pokemonName).then(
            pokemon => {
                setState({status: 'resolved', pokemon})
            },
            error => {
                setState({status: 'rejected', error});
                error => handleError(error)
            },
        )
    }, [pokemonName])

    if (status === 'idle') {
        return 'Submit a pokemon'
    } else if (status === 'pending') {
        return <PokemonInfoFallback name={pokemonName}/>
    } else if (status === 'rejected') {
        throw error
    } else if (status === 'resolved') {
        return <PokemonDataView pokemon={pokemon}/>
    }

    throw new Error('This should be impossible')
}

function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <div>
            There was an error:{' '}
            <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}

function App() {
    const [pokemonName, setPokemonName] = React.useState('')

    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName)
    }

    function handleReset() {
        setPokemonName('')
    }

    return (
        <div className="pokemon-info-app">
            <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit}/>
            <hr/>
            <div className="pokemon-info">
                <ErrorBoundary key={pokemonName} onReset={handleReset} FallbackComponent={ErrorFallback}>
                    <PokemonInfo pokemonName={pokemonName}/>
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default App
