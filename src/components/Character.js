export default function Character(props) {
  function addToWishlist() {
    props.setTotal(props.total + props.item.rarity);
    props.setWishlist((wishlist) => {
      let newWishlist = [...wishlist];
      newWishlist[props.index] += 1;
      return newWishlist;
    });
  }

  function removeFromWishlist() {
    if (props.wishlist[props.index] > 0) {
      props.setTotal(props.total - props.item.rarity);
    }
    props.setWishlist((wishlist) => {
      let newWishlist = [...wishlist];
      newWishlist[props.index] -= 1;
      return newWishlist;
    });
  }

  return (
    <div className="char">
      <img
        src={
          "https://api.genshin.dev/characters/" +
          props.item.name
            .replace(" ", "-")
            .toLowerCase()
            .replace("kamisato-", "")
            .replace("kaedehara-", "")
            .replace("sangonomiya-", "")
            .replace("-shogun", "")
            .replace("kujou-", "") +
          "/icon-big"
        }
        alt={props.item.name}
        className="charImg"
      />
      <p className="charText-title">{props.item.name}</p>
      <p className="charText">
        <i>{props.item.title}</i>
      </p>
      <p className="charText">
        {props.item.rarity}&#9733;, {props.item.vision}, {props.item.weapon},{" "}
        {props.item.nation}
      </p>
      <button onClick={addToWishlist} className="charButton-add">
        Add to Wishlist
      </button>
      <button onClick={removeFromWishlist} className="charButton-remove">
        Remove from Wishlist
      </button>
    </div>
  );
}
