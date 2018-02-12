const fs = require("fs");

const cliArguments = process.argv.slice(2);

const fileName = cliArguments[0] || "books.json";
const authorsFileName = cliArguments[1] || "authors.json";
const titleFileName = cliArguments[1] || "title.json";
const authorsBookFileName = cliArguments[1] || "authorsBook.json";

fs.readFile(fileName, {
    encoding: 'utf8'
}, (err, data) => {
    if (err) {
        console.log(`Error ${err} happened`);
        return;
    }

    const parsedData = JSON.parse(data);
    let books = [];
    if (Array.isArray(parsedData)) {
        books = parsedData;
    } else {
        books = parsedData.items;
    }


	// Title sort

	const title = books.sort((a, b) => {
    	return b.title.length - a.title.length
	}).map((item) => item.title);

	// Author uniqueness
    const authors = []
    books.map((item) => {
        if (!authors.includes(item.author)) {
            authors.push(item.author)
        }
    });

    // Author aggregate
    const authorsBook = [...books.reduce( (mp, o) => {
        if (!mp.has(o.author)) mp.set(o.author, Object.assign({}, {author: o.author}, { books: 0 }));
        mp.get(o.author).books++;
        return mp;
    }, new Map).values()];
	
    let result = JSON.stringify(authorsBook, null, 2);

    fs.writeFile(authorsBookFileName, result, (err) => {
        if (err) {
          console.log(`Error ${err} happened`);
            return;
        } else {
            console.log(`Written ${authorsBookFileName}`);
        }
    });

});
