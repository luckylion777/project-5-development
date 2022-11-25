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
  const [names, setNames] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState(allData);
  const [wishlist, setWishlist] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterMode, setFilterMode] = useState([]);
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
      // TODO: Add title to Collei: "Avidya Forest Ranger Trainee"
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
        setAllData(response.map((res) => res.data));
        setFilteredData(response.map((res) => res.data));
        setWishlist(Array(response.length).fill(0));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [names]);

  // Handle filtering
  function handleFilter(event) {
    let filteredData = [...allData];
    switch (event.target.value) {
      case "5*":
        filteredData = filteredData.filter(
          (character) => character.rarity === 5
        );
        break;
      case "4*":
        filteredData = filteredData.filter(
          (character) => character.rarity === 4
        );
        break;
      case "Pyro":
        filteredData = filteredData.filter(
          (character) => character.vision === "Pyro"
        );
        break;
      case "Hydro":
        filteredData = filteredData.filter(
          (character) => character.vision === "Hydro"
        );
        break;
      case "Electro":
        filteredData = filteredData.filter(
          (character) => character.vision === "Electro"
        );
        break;
      case "Anemo":
        filteredData = filteredData.filter(
          (character) => character.vision === "Anemo"
        );
        break;
      case "Cryo":
        filteredData = filteredData.filter(
          (character) => character.vision === "Cryo"
        );
        break;
      case "Geo":
        filteredData = filteredData.filter(
          (character) => character.vision === "Geo"
        );
        break;
      case "Dendro":
        filteredData = filteredData.filter(
          (character) => character.vision === "Dendro"
        );
        break;
      case "Sword":
        filteredData = filteredData.filter(
          (character) => character.weapon === "Sword"
        );
        break;
      case "Claymore":
        filteredData = filteredData.filter(
          (character) => character.weapon === "Claymore"
        );
        break;
      case "Polearm":
        filteredData = filteredData.filter(
          (character) => character.weapon === "Polearm"
        );
        break;
      case "Bow":
        filteredData = filteredData.filter(
          (character) => character.weapon === "Bow"
        );
        break;
      case "Catalyst":
        filteredData = filteredData.filter(
          (character) => character.weapon === "Catalyst"
        );
        break;
      case "Mondstadt":
        filteredData = filteredData.filter(
          (character) => character.nation === "Mondstadt"
        );
        break;
      case "Liyue":
        filteredData = filteredData.filter(
          (character) => character.nation === "Liyue"
        );
        break;
      case "Inazuma":
        filteredData = filteredData.filter(
          (character) => character.nation === "Inazuma"
        );
        break;
      case "Sumeru":
        filteredData = filteredData.filter(
          (character) => character.nation === "Sumeru"
        );
        break;
      default:
        break;
    }
    setFilteredData(filteredData);
    setFilterMode(event.target.value);
  }

  // Handle sorting
  function handleSort(event) {
    let sortedData = [...allData];
    switch (event.target.value) {
      case "name":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "title":
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setFilteredData(sortedData);
    setSortMode(event.target.value);
  }

  // Reset all sorting and filtering
  function handleReset() {
    setFilteredData(allData);
    setFilterMode([]);
    setSortMode("");
  }

  return (
    <div className="App">
      <h1>Genshin Impact Wishlist Tracker</h1>
      <div className="optionMenu">
        {/* Form for sorting */}
        <FormControl size="small" sx={{ mr: 1, width: 230 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sortMode} label="Sort mode" onChange={handleSort}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"name"}>Name</MenuItem>
            <MenuItem value={"title"}>Title</MenuItem>
          </Select>
        </FormControl>
        {/* Form for filtering */}
        <FormControl size="small" sx={{ mr: 1, width: 610 }}>
          <InputLabel>Filter by</InputLabel>
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
          size="medium"
          onClick={() => {
            handleReset();
          }}
        >
          Reset Sort and Filter
        </Button>
      </div>
      <div className="appContainer">
        <div className="characters">
          {filteredData.map((item, index) => (
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
            {/* Resets the entire wishlist */}
            <button
              onClick={() => {
                setWishlist(Array(wishlist.length).fill(0));
                setTotal(0);
              }}
              className="charButton"
            >
              Reset Cart
            </button>
            {wishlist.map((item, index) => {
              if (item > 0) {
                return (
                  <p>
                    {item}x {filteredData[index].name} {}
                    {/* Add a copy of a character to the wishlist */}
                    <button
                      onClick={() => {
                        setTotal(total + filteredData[index].rarity);
                        setWishlist((wishlist) => {
                          let newWishlist = [...wishlist];
                          newWishlist[index] += 1;
                          return newWishlist;
                        });
                      }}
                      className="charButton"
                    >
                      +
                    </button>
                    {/* Remove a copy of a character from the wishlist */}
                    <button
                      onClick={() => {
                        if (wishlist[index] > 0) {
                          setTotal(total - filteredData[index].rarity);
                        }
                        setWishlist((wishlist) => {
                          let newWishlist = [...wishlist];
                          newWishlist[index] -= 1;
                          return newWishlist;
                        });
                      }}
                      className="charButton"
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
