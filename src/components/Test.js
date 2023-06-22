'use client'
import { useState, useEffect } from 'react'

export default function Test() {
  const DISPLAY_CANDIDATES = [
    "beast", "races", "alert", "angel", "tacos", "stare", 
    "baker", "beard", "begin", "elbow", "sober", "space", 
    "crate", "cider", "claps", "cruel", "trade", "dates", 
    "edits", "wordy", "reward", "earns", "heart", "times", 
    "three", "share", "shape", "shore", "lapse", "plate", 
    "steal", "smile", "glide", "pools", "slope", "names", 
    "meats", "timer", "snail", "tenor", "stone", "pedal", 
    "plane", "spear", "strap", "tapes", "slept", "piers", 
    "spine", "point", "ropes", "rinse", "steer", "tires", 
    "saint", "verse", "swine", "skate", "taste", "wider",
    "dealt", "inset", "taper", "crash", "lamps", "lives" 
  ];

  //small array to test simple things without a lot of anagram candidates
  // const DISPLAY_CANDIDATES = ["crash", "begin"];

  const [possibleAnagrams, setPossibleAnagrams] = useState([]);
  const [anagramsFound, setAnagramsFound] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [typedGuess, setTypedGuess] = useState('');
  const [guessRightOrWrongText, setGuessRightOrWrongText] = useState('')

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
        setGuessRightOrWrongText('');
        setAnagramsFound([]);
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

      //added this to make sure that it finds an anagram if people accidentally type a space after or before what they're guessing
      const submittedGuess = typedGuess.trim();

      if(possibleAnagrams.includes(submittedGuess)) {
        setGuessRightOrWrongText('Nice job, you found an anagram!');
        setAnagramsFound([submittedGuess, ...anagramsFound]);
        setPossibleAnagrams(possibleAnagrams.filter(anagram => anagram !== submittedGuess));
      } else if(anagramsFound.includes(submittedGuess)) {
        setGuessRightOrWrongText('You already found this anagram! Try again.')
      } else  {
        setGuessRightOrWrongText('Sorry, your guess was not an anagram for this word :(');
      }

      //clear the text you just typed
      setTypedGuess('');
    }

    const resetGame = () => {
      setNewGame(!newGame);
    };

    //show loading screen while waiting for the word and its anagrams to get loaded
    if(displayName.length === 0) {
      return <h1>Loading...</h1>
    }

  return (
    <div>
      <h1>Anagram Game</h1>
      <p>{displayName}</p>
      <p>{possibleAnagrams.length === 0 ? "Congrats, you win!" : `Anagrams left to find: ${possibleAnagrams.length}`}</p>
      <p>{possibleAnagrams.length === 0 ? "" : guessRightOrWrongText}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="guess" label="guess" value={typedGuess} onChange={handleTypedGuessChange} disabled={possibleAnagrams.length === 0} />
        <button type="submit" disabled={typedGuess.length === 0}>Submit</button>
        {possibleAnagrams.length === 0 && <button onClick={resetGame}>Play Again?</button>}
      </form>
      <div>
        {anagramsFound.map((word, index) => <p key={index}>{word}</p>)}
      </div>
    </div>
  )
}
