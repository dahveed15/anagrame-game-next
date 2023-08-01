'use client'
import { useState, useEffect } from 'react'

export default function Test() {

  const CATEGORIES = {
    api: {
      four_letters: [
        "abed", "bate", "tuba", "came", "care", "sale",
        "name", "wane", "cars", "pass", "laws", "bard",
        "bats", "grab", "lead", "read", "edit", "mode",
        "does", "used", "ears", "ates", "elan", "nose",
        "time", "evil", "wolf", "guns", "goer", "gust",
        "hose", "shop", "gyro", "hear", "kins", "ires",
        "lake", "rail", "male", "last", "late", "pale",
        "slip", "list", "loop", "slot", "tams", "team",
        "same", "neap", "snap", "sent", "open", "stop",
        "snow", "spar", "trap", "past", "pets", "wasp",
        "tire", "west", "wost", "sway", "bear", "deer",
        "calm", "goat", "aunt", "kiss", "rent", "save",
        "case", "each", "cane", "cats", "dads", "daze",
        "year", "afro", "raga", "sega", "idea", "said",
        "sail", "raja", "labs", "gala", "lams"
      ],
      five_letters: [
        "beast", "races", "alert", "angel", "tacos", "stare", 
        "baker", "beard", "begin", "elbow", "sober", "space", 
        "crate", "cider", "claps", "cruel", "trade", "dates", 
        "edits", "wordy", "olive", "earns", "heart", "times", 
        "three", "share", "shape", "shore", "lapse", "plate", 
        "steal", "smile", "glide", "pools", "slope", "names", 
        "meats", "timer", "snail", "tenor", "stone", "pedal", 
        "plane", "spear", "strap", "tapes", "slept", "piers", 
        "spine", "point", "ropes", "rinse", "steer", "tires", 
        "saint", "verse", "swine", "skate", "taste", "wider",
        "dealt", "inset", "taper", "lapse", "lamps", "lives",
        "crash", "ameba", "abler", "adobe", "abuse", "aches",
        "dread", "laded", "taped", "named", "adore", "adorn",
        "agree", "ideas", "ideal", "aimed", "large", "allot",
        "loyal", "float"
      ],
      six_letters: [
        "actors", "remain", "rental", "search", "artist", "asleep",
        "assert", "barely", "subtle", "cellar", "nectar", "crates",
        "sector", "danger", "thread", "deigns", "lasted", "desert",
        "detail", "detour", "diaper", "stride", "padres", "rusted",
        "earned", "remote", "envied", "listen", "esprit", "forest",
        "aisled", "mental", "looped", "lemons", "silver", "sparse",
        "master", "mister", "naiver", "plates", "replay", "points",
        "rashes", "sering", "recuse", "resort", "street", "ablest",
        "sedate", "skated", "steals", "tetras", "wither", "reward",
        "abides", "aboard", "abodes", "action", "acuter", "dreads",
        "addles", "adepts", "header", "admits", "soared", "braved",
        "visaed", "easier", "affair", "failed", "images", "agreed",
        "agrees", "lassie", "alcove", "slater", "aliens", "aligns",
        "nailed", "allots", "allows", "allure"
      ],
      seven_letters: [
        "observe", "marines", "trainer", "dealing", "related", "allergy",
        "staider", "diapers", "nectars", "capitol", "created", "decimal",
        "threads", "demerit", "nearest", "gleaner", "esprits", "players",
        "pirates", "protest", "present", "startle", "retails", "painter",
        "restful", "abridge", "caracul", "accrues", "acrider", "actions",
        "casters", "redhead", "hearsed", "married", "misread", "adverts",
        "arising", "serials", "alcoves", "algeria", "overall", "swallow",
        "allures"
      ],
      eight_letters: [
        "arrogant", "spiracle", "recanted", "counters", "retraced", "resigned",
        "nameless", "prorated", "presents", "trainers", "thickest", "idolatry",
        "alerting", "harbored", "canoeist", "autocrat", "adjuster", "canvased",
        "coasting", "ailments", "alarming", "elastics", "allotted"
      ],
      nine_letters: [
        "education", "casserole", "mastering", "actuators", "statement", "algorithm",
        "alignment", "galleries", "allotting"
      ]
    },
    extras: {
      //TODO: this will be for 10+ letter anagrams
      ten_letters: {
        deductions: ["discounted"],
        harmonicas: ["maraschino"],
        percussion: ["supersonic"],
        introduces: ["discounter", "reductions"],
        compressed: ["decompress"],
        inactivate: ["vaticinate"],
        alarmingly: ["marginally"],
        antagonist: ["stagnation"],
        coordinate: ["decoration"],
        indicatory: ["dictionary"],
        excitation: ["intoxicate"],
        pleonastic: ["neoplastic"],
        domination: ["admonition"],
        algorithms: ["logarithms"],
      },
      eleven_letters: {
        algorithmic: ["logarithmic"]
      }
    }
  };

  const API_WORD_LIST = Object.values(CATEGORIES.api).flat();

  const shuffleWords = (arr) => {
      return arr
              .map(value => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value)
  };

  //small array to test simple things without a lot of anagram candidates
  // const FIVE_LETTER_WORDS = ["crash", "begin"];

  const [possibleAnagrams, setPossibleAnagrams] = useState([]);
  const [anagramsFound, setAnagramsFound] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [typedGuess, setTypedGuess] = useState('');
  const [guessRightOrWrongText, setGuessRightOrWrongText] = useState('');
  const [tries, setTries] = useState(0);

  //This will be responsible for resetting the game.
  //By adding it as a dependency variable, it will kick off loading up the anagrams for the random word chosen every time "Play Again?" is clicked
  const [newGame, setNewGame] = useState(false);

  const noAnagramsLeft = possibleAnagrams.length === 0;

    useEffect(() => {

      const getAnagramData = async () => {
        const shuffledWordList = shuffleWords(API_WORD_LIST);
        const displayCandidate = shuffledWordList[Math.floor(Math.random() * shuffledWordList.length)];
        const res = await fetch("http://localhost:3000/api/anagram/", {
          headers: { word: displayCandidate },
        });
    
        const anagramData = await res.json();

        setDisplayName(displayCandidate);
        setGuessRightOrWrongText('');
        setAnagramsFound([]);
        setIncorrectGuesses([]);
        setTries(0);
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

      //added this to make sure that it finds an anagram if people accidentally add space, numbers, casing, or punctuation in their guess
      const submittedGuess = typedGuess.toLowerCase().replace(/\W|_|[0-9]/g, '')

      if(possibleAnagrams.includes(submittedGuess)) {
        setGuessRightOrWrongText('Nice job, you found an anagram!');
        setAnagramsFound([submittedGuess, ...anagramsFound]);
        setPossibleAnagrams(possibleAnagrams.filter(anagram => anagram !== submittedGuess));
      } else if(submittedGuess === displayName) {
        setGuessRightOrWrongText(`Sorry, ${displayName} is not a valid guess. You need to guess a new word by rearranging every letter in this word.`);
      } else if(anagramsFound.includes(submittedGuess)) {
        setGuessRightOrWrongText('You already found this anagram! Try again.');
      } else  {
        //filter out unique words if people type the same incorrect guess multiple times
        setIncorrectGuesses([...new Set([...incorrectGuesses, submittedGuess])]);
        setGuessRightOrWrongText(`Sorry, ${submittedGuess} was not an anagram for this word :(`);
      }

      //clear the text you just typed
      setTypedGuess('');

      setTries(tries + 1);      
    }

    const resetGame = () => {
      setNewGame(!newGame);
    };

    const renderTypedResults = (typedResults, title) => {
      return (
        <div>
          {typedResults.length > 0 &&
          <div>
            <h2>{title}</h2>
            {typedResults.map((word, index) => <p key={index}>{word}</p>)}
          </div> 
          }
      </div>
      );
    };

    //show loading screen while waiting for the word and its anagrams to get loaded
    if(displayName.length === 0) {
      return <h1>Loading...</h1>
    }

  return (
    <div>
      <h1>Anagram Game</h1>
      <p>{displayName}</p>
      <p>Tries: {tries}</p>
      <p>{noAnagramsLeft ? `Congrats, you win! You beat the game in ${tries} tries.` : `Anagrams left to find: ${possibleAnagrams.length}`}</p>
      {noAnagramsLeft && <button autoFocus onClick={resetGame}>Play Again?</button>}
      <p>{noAnagramsLeft ? "" : guessRightOrWrongText}</p>
      <form onSubmit={handleSubmit}>
        <input type="text" name="guess" label="guess" value={typedGuess} autoFocus onChange={handleTypedGuessChange} disabled={noAnagramsLeft} />
        <button type="submit" disabled={typedGuess.length === 0}>Submit</button>
      </form>
      {renderTypedResults(anagramsFound, "Anagrams Found:")}
      {renderTypedResults(incorrectGuesses, "Incorrect Guesses:")}
    </div>
  )
}
