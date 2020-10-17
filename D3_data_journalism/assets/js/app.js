  // Get the data
  d3.csv("./assets/data/data.csv", d3.autoType).then((data) => {
    console.log(data);// @TODO: YOUR CODE HERE!
 
  }).catch(error => console.log(error));



