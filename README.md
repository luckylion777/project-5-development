# Development

### Link to Deployed Website

https://luckylion777.github.io/project-5-development

### Quick Notes

- As of now, the site is not ready to be used on mobile devices.
- The aggregator is known as the "wishlist" in my application.
- The unit being aggregated is the amount of "stars" a character has, which represents its rarity.

### Goal and Value of the Application

Genshin Impact is a very popular game with over 60 million players and a plethora of awards. One of the main reasons players like me are so invested into the game is because of the amazing cast of characters, which are obtainable through a rotating gacha system. Therefore, the goal of my web application is to be a convenient tool for players to keep track of which characters they would like to obtain in the future. I think that this app can be valuable because it is a visual list where information about each character can be included, and I have not found any sites like this before. Moreover, I used an API that the community made to extract game data, so I believe my website would automatically be updated with every new character releases every month. Since this is the first release, the site could be improved upon in the future to include even more information. The reason why one can add multiple copies of a character to the wishlist is because duplicates in the game give massive upgrades to the character.

### Usability Principles Considered
I wanted to make this application as easy to understand and convenient as possible, so I focused on these design choices:

- The dropdown menus for sorting and filtering are at the top of the page.
- The sorting menu has a "None" option in italics so that the user knows how to reset the sort.
- The filtering menu has checkboxes so its easy to understand which filters are being applied.
- The filtering shows when multiple filters are being applied in the bar ("filter1, filter2, etc.").
- The reset buttons for the sort/filter and wishlist pop out with a blue color.
- Each character card in the list has information presented in the same format, including an "add" button in blue and a "remove" button in gray so that a hierarchy can be maintained.
- Each character in the wishlist has an "add" button and "remove" button with the same design as those in the last bullet so that a hierarchy can be maintained.
- The wishlist is on the same page as the character list so the user can easily track what changes they are making.

### Organization of Components

For this application, I have made one generic component to represent a character card, with its code located in the Character.js file. These cards display information from the API about each character and include functions to add and remove them from the wishlist.

### How Data is Passed Down Through Components

After I extract and parse information about each character (in the form of a JSON object) through useEffect() hooks, I map through this array of data and pass it through props into each character component. This data includes:

- The key of the character (for tracking them in the data arrays)
- The character's JSON object (for the components to extract display information from)
- The character's index adjusted for filters/sorts (the way I track how many of each character there are in the wishlist is through a state variable that is initialized to be full of zeroes, where each index of the array represents the amount of one character; therefore, adding one character to the wishlist adds 1 to the number in the array at that character's index)
- The state variables for the wishlist (character component has functions that affect the individual quantities in the wishlist)
- The state variables for the wishlist total (character component has functions that affect the total quantity of the wishlist)

### How the User Triggers State Changes

For more information on types, feel free to check the comments ini the App.js code file where I declare my states.

There are a lot of states that I use for this application, so I will go through their changes individually:

- [names, setNames]: Array of names of the characters. This state is set in a useEffect() when getting data from the API. This state is referenced in a useEffect() when getting the character JSON objects from the API.
- [allData, setAllData]: Array of JSON objects of the characters to track the data without sorting or filtering. This state is set in a useEffect() when getting the objects from the API. This state is referenced in the useEffect() that handles sorting/filtering, as changing it should also changed the items being sorted. This state is referenced in the reset button's function so that the sorted/filtered data can go back to normal. This state is referenced in the wishlist's code because the items being added should be from the full array of characters, not one that has been sorted or filtered.
- [someData, setSomeData]: Array of JSON objects of the characters to track the data with sorting or filtering. This state is initialized to be equal to allData, but then changed in a useEffect() that handles sorting/filtering. Additionally, this useEffect() includes dependencies for when the filterMode, sortMode, or allData changes, which logically makes sense since this would require re-rendering in the app. It is reset back to allData in the reset button's function. This state is referenced in the character list's code so that the list changes based on which sorting or filtering actions were performed.
- [wishlist, setWishlist]: Array of numbers that represents how many of each character (the indices of the array) are in the wishlist. This state is initially set to be an array of zeroes. This state is referenced in the "reset wishlist", "add", and "remove" buttons' functions and changes the numbers at certain indexes accordingly.
- [total, setTotal]: Number that represents the total amount of stars/rarity (unit of accumulation) of the characters in the cart. This state is referenced in the "reset wishlist", "add", and "remove" buttons' functions and changes the total accordingly.
- [filterMode, setFilterMode]: Array of applied filter criteria, originally initialized to be empty. This state is set when the user selects options from the drop-down filter menu and reset when the user uses the reset sorting/filtering button. This state is referenced in a useEffect() that handles sorting/filtering.
- [sortMode, setSortMode]: String representing sort criteria, originally initialized to be an empty string. This state is set when the user selects options from the drop-down sort menu and reset when the user uses the reset sorting/filtering button. This state is referenced in a useEffect() that handles sorting/filtering.
