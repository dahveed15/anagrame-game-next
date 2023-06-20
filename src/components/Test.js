'use client'
import { useState, useEffect } from 'react'

export default function Test() {
  const DISPLAY_CANDIDATES = [
    "beast", "races", "alert", "angel", "tacos", "stare", 
    "baker", "beard", "begin", "elbow", "sober", "space", 
    "crate", "cider", "claps", "cruel", "trade", "dates", 
    "edits", "wordy", "reward", "earns", "heart", "times", 
    "three", "share", "shape", "shore", "lapse", "plate", 
    "steal", "smile", "liter", "pools", "slope", "names", 
    "meats", "timer", "snail", "tenor", "stone", "pedal", 
    "plane", "spear", "strap", "tapes", "slept", "piers", 
    "spine", "point", "ropes", "rinse", "steer", "tires", 
    "saint", "verse", "swine", "skate", "taste", "wider",
    "dealt", "inset", "taper", "crash", "lamps", "lives" 
  ];

  //small array to test simple things without a lot of anagram candidates
  // const DISPLAY_CANDIDATES = ["crash", "begin"];

  const [possibleAnagrams, setPossibleAnagrams] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [typedGuess, setTypedGuess] = useState('');

  //This will be responsible for resetting the game.
  //By adding it as a dependency variable, it will kick off loading up the anagrams for the random word chosen every time "Play Again?" is clicked
  const [newGame, setNewGame] = useState(false);

    useEffect(() => {

      const getAnagramData = async () => {
        const displayCandidate = DISPLAY_CANDIDATES[Math.floor(Math.random() * DISPLAY_CANDIDATES.length)];
        const res = await fetch("http://localhost:3000/api/anagram/", {
          headers: { word: displayCandidate },
        });
    
        const anagramData = await res.json();

        setDisplayName(displayCandidate);
        setPossibleAnagrams(anagramData.best.filter(word => word !== displayCandidate));
    }
    getAnagramData()
    // make sure to catch any error
    .catch(console.error);
  
    }, [newGame])

    

    const handleTypedGuessChange = (e) => {
      setTypedGuess(e.target.value);
    }

    const handleSubmit = (e) => {
      e.preventDefault();

      const submittedGuess = typedGuess;

      if(possibleAnagrams.includes(submittedGuess)) {
        setPossibleAnagrams(possibleAnagrams.filter(anagram => anagram !== submittedGuess))
      }

      //clear the text you just typed
      setTypedGuess('');
    }

    const resetGame = () => {
      // setDisplayName('')
      setNewGame(!newGame);
    };

    //show loading screen while waiting for the word and its anagrams to get loaded
    if(displayName.length === 0) {
      return <h1>Loading...</h1>
    }

    //add displayed anagrams that you've found to make it easier to keep track and think about the ones missing
    //commit what you have so far to git

  return (
    <div>
      <h1>Anagram Game</h1>
      <p>{displayName}</p>
      <p>{possibleAnagrams.length === 0 ? "Congrats, you win!" : `Anagrams left to find: ${possibleAnagrams.length}`}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="guess" label="guess" value={typedGuess} onChange={handleTypedGuessChange} disabled={possibleAnagrams.length === 0} />
        <button type="submit" disabled={typedGuess.length === 0}>Submit</button>
        {possibleAnagrams.length === 0 && <button onClick={resetGame}>Play Again?</button>}
      </form>
    </div>
  )
}
