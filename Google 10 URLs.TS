let a_href = document.querySelectorAll(".yuRUbf a");
let linksArray = [];
a_href.forEach(function(params, index) {
    linksArray.push({
        index: index + 1,
        url: params.href
    });
});
let jsonOutput = JSON.stringify(linksArray, null, 2);
console.log(jsonOutput);