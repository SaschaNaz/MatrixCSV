var MatrixCSV;
(function (MatrixCSV) {
    function readFile(file, onload, delimiter) {
        if (typeof delimiter === "undefined") { delimiter = ','; }
        var reader = new FileReader();
        reader.onload = function (ev) {
            onload(MatrixCSV.decode(ev.target.result, delimiter));
        };
        reader.readAsText(file);
    }
    MatrixCSV.readFile = readFile;
    function decode(text, delimiter) {
        if (typeof delimiter === "undefined") { delimiter = ','; }
        var matrix = new Matrix();
        var currentPosition = 0;
        var linePosition = 1;
        while (currentPosition < text.length) {
            var lineObject = readLine(text, currentPosition);
            if (!lineObject)
                break;
            currentPosition = lineObject.nextPosition;

            var splitted = splitByDelimiter(lineObject.line, delimiter);
            for (var i = 1; i <= splitted.length; i++) {
                matrix.set([linePosition, i], splitted[i - 1]);
            }
            linePosition++;
        }
        return matrix;
    }
    MatrixCSV.decode = decode;
    function readLine(str, startIndex) {
        var found = str.indexOf('\n', startIndex);
        if (found != -1)
            return { line: str.slice(startIndex, found), nextPosition: found + 1 };
        else
            return { line: str.slice(startIndex), nextPosition: str.length };
    }
    function splitByDelimiter(str, delimiter) {
        var isInQuote = false;
        var items = [];
        var item = "";
        var mayQuoteEnd = false;

        for (var i = 0; i < str.length; i++) {
            var char = str[i];

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
                } else if (isInQuote) {
                    if (!mayQuoteEnd) {
                        mayQuoteEnd = true;
                        continue;
                    } else
                        mayQuoteEnd = false;
                }
            } else if (mayQuoteEnd)
                mayQuoteEnd = false;

            item += char;
        }

        return items;
    }

    function encode(matrix) {
        var result = "";
        var line = 1;
        if (matrix.dimension != 2)
            throw new Error("Matrix should be 2-dimensional to be saved as CSV.");
        matrix.forEach(function (item, coordinate) {
            if (coordinate[0] != line) {
                result += "\r\n";
                line++;
            } else if (coordinate[1] != 1) {
                result += ',';
            }

            if (item === undefined)
                return;
            item = "" + item;
            if (item.match(/[,\"]/))
                result += escape(item);
            else
                result += item;
        });
        return result;
    }
    MatrixCSV.encode = encode;
    function escape(input) {
        return '"' + input.replace(/\"/g, '""') + '"';
    }
})(MatrixCSV || (MatrixCSV = {}));
//# sourceMappingURL=matrixcsv.js.map
