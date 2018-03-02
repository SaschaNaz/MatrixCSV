var MatrixCSV;
(function (MatrixCSV) {
    var Matrix = SNMath.Matrix;
    function readFile(file, delimiter = ',') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = ev => {
                resolve(MatrixCSV.decode(ev.target.result, delimiter));
            };
            reader.readAsText(file);
        });
    }
    MatrixCSV.readFile = readFile;
    function decode(text, delimiter = ',') {
        const matrix = new Matrix();
        let currentPosition = 0;
        let linePosition = 1;
        let hasUnclosedQuote = false;
        const items = [];
        while (currentPosition < text.length) {
            const lineObject = readLine(text, currentPosition);
            if (!lineObject) {
                break;
            }
            currentPosition = lineObject.nextPosition;
            try {
                const result = splitByDelimiter(lineObject.line, delimiter, hasUnclosedQuote);
                if (hasUnclosedQuote) {
                    items[items.length - 1] = `${items[items.length - 1]}\n${result.items.shift()}`;
                }
                items.push(...result.items);
                hasUnclosedQuote = result.hasUnclosedQuote;
            }
            catch (e) {
                throw new Error("CSV Error: Line " + linePosition + ", " + e.message);
            }
            if (!hasUnclosedQuote) {
                for (let i = 1; i <= items.length; i++) {
                    matrix.set([linePosition, i], items[i - 1]);
                }
                linePosition++;
                items.length = 0;
            }
        }
        return matrix;
    }
    MatrixCSV.decode = decode;
    function readLine(str, startIndex) {
        const firstcut = str.slice(startIndex);
        const found = firstcut.search(/[\r\n]/);
        if (found != -1) {
            const length = firstcut.slice(found).match(/[\r\n]+/)[0].length;
            return { line: firstcut.slice(0, found), nextPosition: startIndex + found + length };
        }
        else
            return { line: firstcut, nextPosition: str.length };
    }
    function splitByDelimiter(str, delimiter, isInQuote = false) {
        const items = [];
        let item = "";
        let mayQuoteEnd = false; //just met a quotation mark in a quote
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            //delimiter
            if (char === delimiter && !(isInQuote && !mayQuoteEnd)) {
                items.push(item);
                item = "";
                isInQuote = false;
                mayQuoteEnd = false;
                continue;
            }
            //quote escaping
            if (char === '"') {
                if (isInQuote) {
                    if (!mayQuoteEnd) {
                        mayQuoteEnd = true;
                        continue;
                    }
                    else {
                        mayQuoteEnd = false;
                    }
                }
                else if (item.length != 0) {
                    throw new Error(`column (${i}): double quotation mark occured without cell quotation.`);
                }
                else {
                    isInQuote = true;
                    continue;
                }
            }
            else if (mayQuoteEnd) {
                throw new Error(`column (${i}): quote is incorrectly ended.`);
            }
            item += char;
        }
        items.push(item);
        return { items, hasUnclosedQuote: isInQuote && !mayQuoteEnd };
    }
    function encode(matrix) {
        let result = "";
        let line = 1;
        if (matrix.dimension != 2) {
            throw new Error("Matrix should be 2-dimensional to be saved as CSV.");
        }
        matrix.forEach((item, coordinate) => {
            if (coordinate[0] != line) {
                result += "\r\n";
                line++;
            }
            else if (coordinate[1] != 1) {
                result += ',';
            }
            if (item === undefined) {
                return;
            }
            item = "" + item;
            if (item.match(/[,\"\r\n]/)) {
                result += escape(item);
            }
            else {
                result += item;
            }
        });
        return result;
    }
    MatrixCSV.encode = encode;
    function escape(input) {
        return `"${input.replace(/\"/g, '""')}"`;
    }
})(MatrixCSV || (MatrixCSV = {}));
//# sourceMappingURL=matrixcsv.js.map