import './App.css';
import axios from 'axios'
import React, {useState, useEffect} from 'react';
import Character from "./components/Character";

function App() {
  const [names, setNames] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(allData);
  const [wishlist, setWishlist] = useState(Array(allData.length).fill(0));
  const [total, setTotal] = useState(0);

  // Get the character names from the API
  useEffect(() => {
    axios.get('https://api.genshin.dev/characters').then(response => {
      setNames(response.data);
    }).catch(error => {
      console.log(error);
    })
  }, []);

  // Get the character data from the API
  useEffect(() => {
    let promises = [];
    names.forEach(name => {
      // Remove characters that are too new to have images or are not obtainable through the gacha system
      if (name !== 'aloy' && name !== 'traveler-anemo' && name !== 'traveler-geo' && name !== 'traveler-electro' && name !== 'traveler-dendro') {
        promises.push(axios.get('https://api.genshin.dev/characters/' + name));
      }
    });
    Promise.all(promises).then(response => {
      setAllData(response.map(res => res.data));
      setFilteredData(response.map(res => res.data));
    }).catch(error => {
      console.log(error);
    })
  }, [names]);

  return (
    <div className="App">
      <h1>Genshin Impact Wishlist</h1>
      <div className="appContainer">
        <div className="characters">
          {allData.map((item, index) => (
            <Character
              key={index}
              item={item}
              wishlist={wishlist}
              setWishlist={setWishlist}
              index={index}
              total={total}
              setTotal={setTotal}
            />
          ))}
        </div>
        <div className="wishlist">
          <h2>My Wishlist</h2>
            <p>
            Total: {total}&#9733;
              {wishlist.map((item, index) => {
                if (item > 0) {
                  return (
                    <p>
                      {item}x {allData[index].name}
                    </p>
                  );
                }
              })}
            </p>
        </div>
      </div>
    </div>
  );
}

export default App;
