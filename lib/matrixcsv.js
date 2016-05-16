var MatrixCSV;
(function (MatrixCSV) {
    function readFile(file, delimiter = ',') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
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
        while (currentPosition < text.length) {
            const lineObject = readLine(text, currentPosition);
            if (!lineObject) {
                break;
            }
            currentPosition = lineObject.nextPosition;
            let splitted;
            try {
                splitted = splitByDelimiter(lineObject.line, delimiter); //lineObject.line.split(delimiter);
            }
            catch (e) {
                throw new Error("CSV Error: Line " + linePosition + ", " + e.message);
            }
            for (let i = 1; i <= splitted.length; i++) {
                matrix.set([linePosition, i], splitted[i - 1]);
            }
            linePosition++;
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
    function splitByDelimiter(str, delimiter) {
        let isInQuote = false;
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
                if (item.length == 0) {
                    isInQuote = true;
                    continue;
                }
                else if (isInQuote) {
                    if (!mayQuoteEnd) {
                        mayQuoteEnd = true;
                        continue;
                    }
                    else {
                        mayQuoteEnd = false;
                    }
                }
            }
            else if (mayQuoteEnd) {
                throw new Error(`"column (${i + 1}): quote is incorrectly ended.`);
            }
            item += char;
        }
        items.push(item);
        return items;
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
            if (item.match(/[,\"]/)) {
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