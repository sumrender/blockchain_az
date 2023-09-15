// // Create a URL object by passing the URL string as an argument
// var urlString = "https://www.example.com:8080/path/to/page?query=example&id=123#section";
// var url = new URL(urlString);

// // Access different components of the URL
// console.log("Protocol: " + url.protocol); // "https:"
// console.log("Hostname: " + url.hostname); // "www.example.com"
// console.log("Port: " + url.port); // "8080"
// console.log("Pathname: " + url.pathname); // "/path/to/page"
// console.log("Search: " + url.search); // "?query=example&id=123"
// console.log("Hash: " + url.hash); // "#section"

// // You can also get the query parameters as a searchParams object
// var queryParams = url.searchParams;
// console.log("Query Parameter 'query': " + queryParams.get("query")); // "example"
// console.log("Query Parameter 'id': " + queryParams.get("id")); // "123"


const arr = [1, 2, 3];

for(let item of arr){
  console.log(item);
}