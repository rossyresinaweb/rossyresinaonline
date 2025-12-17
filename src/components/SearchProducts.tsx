import React from "react";
import FormattedPrice from "./FormattedPrice";

import { ProductProps } from "../../type";
type Item = {
  item: ProductProps;
};

const SearchProducts = ({ item }: Item) => {
  return (
    <div className="flex items-center gap-4">
      <img className="w-24" src={item.image} alt="productImage" />
      <div>
        <p className="text-xs -mb-1">
          {item.brand}_{item.category}
        </p>
        <p className="text-lg font-medium">{item.title}</p>
        <p className="text-xs">{item.description.substring(0, 100)}</p>
        <p className="text-sm flex items-center gap-1">
          Precio:{" "}
          <span className="font-semibold">
            <FormattedPrice amount={item.price} />
          </span>
          {typeof item.oldPrice === "number" && item.oldPrice > item.price && (
            <span className="text-gray-600 line-through">
              <FormattedPrice amount={item.oldPrice} />
            </span>
          )}
        </p>
      </div>
      <div className="flex-1 text-right px-4">
        {typeof item.oldPrice === "number" && item.oldPrice > item.price && (
          <p className="text-base font-semibold animate-bounce text-amazon_blue">
            Ahorra <FormattedPrice amount={item.oldPrice - item.price} />
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchProducts;
