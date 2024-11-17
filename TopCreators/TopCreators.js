export const getTopCreators = (creators = []) => {  // Set default empty array
  const finalCreators = [];

  // Reduce to group by seller and calculate total prices
  const finalResults = creators.reduce((index, currentValue) => {
    (index[currentValue.seller] = index[currentValue.seller] || []).push(
      currentValue
    );
    return index;
  }, {});

  // Calculate the total for each seller
  Object.entries(finalResults).forEach((item) => {
    const seller = item[0];
    const total = item[1]  // Change item[4] to item[1]
      .map((newItem) => Number(newItem.price))
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    finalCreators.push({ seller, total });
  });

  // Sort creators by total in descending order and take the top 3
  const topCreators = finalCreators
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);  

  return topCreators;
};
