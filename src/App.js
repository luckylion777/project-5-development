import "./App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Character from "./components/Character";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";

function App() {
  /**
   * @type {[string[], (value: string[]) => void]}
   */
  const [names, setNames] = useState([]);
  /**
   * unfiltered data
   * @type {[{}[], (value: {}[]) => void]}
   */
  const [allData, setAllData] = useState([]);
  /**
   * filtered data
   * @type {[{}[], (value: {}[]) => void]}
   */
  const [someData, setSomeData] = useState(allData);
  /**
   * unfiltered cart (count of each character in the cart)
   * @type {[number[], (value: number[]) => void]}
   */
  const [wishlist, setWishlist] = useState([]);
  /**
   * total rarity count of all characters in the cart
   * @type {[number, (value: number) => void]}
   */
  const [total, setTotal] = useState(0);
  /**
   * array of applied filter criteria
   * @type {[string[], (value: string[]) => void]}
   */
  const [filterMode, setFilterMode] = useState([]);
  /**
   * applied sort criteria
   * @type {[string, (value: string) => void]}
   */
  const [sortMode, setSortMode] = useState("");

  const filters = [
    "5*",
    "4*",
    "Pyro",
    "Hydro",
    "Electro",
    "Cryo",
    "Anemo",
    "Geo",
    "Dendro",
    "Sword",
    "Claymore",
    "Polearm",
    "Bow",
    "Catalyst",
    "Mondstadt",
    "Liyue",
    "Inazuma",
    "Sumeru",
  ];

  // Styling code from MaterialUI
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // Get the character names from the API
  useEffect(() => {
    axios
      .get("https://api.genshin.dev/characters")
      .then((response) => {
        setNames(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Get the character data from the API
  useEffect(() => {
    let promises = [];
    names.forEach((name) => {
      // Remove characters that are not obtainable through the gacha system
      if (
        name !== "aloy" &&
        name !== "traveler-anemo" &&
        name !== "traveler-geo" &&
        name !== "traveler-electro" &&
        name !== "traveler-dendro"
      ) {
        promises.push(axios.get("https://api.genshin.dev/characters/" + name));
      }
    });
    Promise.all(promises)
      .then((response) => {
        // Add missing title to Collei: "Avidya Forest Ranger Trainee"
        setAllData(
          response.map((res) => {
            if (res.data.name === "Collei") {
              res.data.title = "Avidya Forest Ranger Trainee";
            }
            return res.data;
          })
        );
        setSomeData(response.map((res) => res.data));
        setWishlist(Array(response.length).fill(0));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [names]);

  // Handle filter mode changes
  function handleFilter(event) {
    setFilterMode(event.target.value);
  }

  // Handle sort mode changes
  function handleSort(event) {
    setSortMode(event.target.value);
  }

  // Handle filtering and sorting
  useEffect(() => {
    let filteredData = [...allData];
    if (filterMode.length > 0) {
      filterMode.forEach((filter) => {
        filteredData = filteredData.filter((character) => {
          return character.rarity.toString() === filter.replace("*", "") ||
            character.vision === filter ||
            character.weapon === filter ||
            character.nation === filter
            ? true
            : false;
        });
      });
    }
    if (sortMode === "name") {
      filteredData.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else if (sortMode === "title") {
      filteredData.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    }
    setSomeData(filteredData);
  }, [filterMode, sortMode, allData]);

  // Reset all sorting and filtering
  function handleReset() {
    setSomeData(allData);
    setFilterMode([]);
    setSortMode("");
  }

  return (
    <div className="App">
      <h1>Genshin Impact Wishlist Tracker</h1>
      <div className="optionMenu">
        {/* Form for sorting */}
        <FormControl size="small" sx={{ mr: 1, width: 0.24 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sortMode} label="Sort mode" onChange={handleSort}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"name"}>Name</MenuItem>
            <MenuItem value={"title"}>Title</MenuItem>
          </Select>
        </FormControl>
        {/* Form for filtering */}
        <FormControl size="small" sx={{ mr: 1, width: 0.5 }}>
          <InputLabel>Filter By</InputLabel>
          <Select
            multiple
            value={filterMode}
            onChange={handleFilter}
            input={<OutlinedInput label="Filter by" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {filters.map((filter) => (
              <MenuItem key={filter} value={filter}>
                <Checkbox checked={filterMode.indexOf(filter) > -1} />
                <ListItemText primary={filter} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Resets the sorting and filtering */}
        <Button
          variant="outlined"
          sx={{
            height: 40,
            width: 0.24,
            textTransform: "capitalize",
            fontSize: 16,
          }}
          onClick={() => {
            handleReset();
          }}
        >
          Reset Sort and Filter
        </Button>
      </div>
      <div className="appContainer">
        <div className="characters">
          {someData.map((item, index) => (
            <Character
              key={index}
              item={item}
              wishlist={wishlist}
              setWishlist={setWishlist}
              index={allData.indexOf(item)}
              total={total}
              setTotal={setTotal}
            />
          ))}
        </div>
        <div className="wishlist">
          <h2>My Wishlist</h2>
          <p>
            Total: {total}&#9733;
            <br />
            {/* Resets the entire wishlist */}
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                textTransform: "capitalize",
              }}
              onClick={() => {
                setWishlist(Array(wishlist.length).fill(0));
                setTotal(0);
              }}
            >
              Reset Wishlist
            </Button>
            {wishlist.map((item, index) => {
              if (item > 0) {
                return (
                  <p>
                    {item}x {allData[index].name} {}
                    {/* Add a copy of a character to the wishlist */}
                    <button
                      onClick={() => {
                        setTotal(total + allData[index].rarity);
                        setWishlist((wishlist) => {
                          let newWishlist = [...wishlist];
                          newWishlist[index] += 1;
                          return newWishlist;
                        });
                      }}
                      className="charButton-add"
                    >
                      +
                    </button>
                    {/* Remove a copy of a character from the wishlist */}
                    <button
                      onClick={() => {
                        if (wishlist[index] > 0) {
                          setTotal(total - allData[index].rarity);
                          setWishlist((wishlist) => {
                            let newWishlist = [...wishlist];
                            newWishlist[index] -= 1;
                            return newWishlist;
                          });
                        }
                      }}
                      className="charButton-remove"
                    >
                      -
                    </button>
                  </p>
                );
              } else {
                return null;
              }
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
