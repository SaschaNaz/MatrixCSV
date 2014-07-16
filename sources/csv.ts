module MatrixCSV {
    interface CSVLine {
        line: string;
        nextPosition: number;
    }
    export function readFile(file: Blob, onload: (matrix: Matrix<string>) => any, delimiter = ',') {
        var reader = new FileReader();
        reader.onload = (ev: Event) => {
            onload(MatrixCSV.decode(<string>(<FileReader>ev.target).result, delimiter));
        };
        reader.readAsText(file);
    }
    export function decode(text: string, delimiter = ',') {
        var matrix = new Matrix<string>();
        var currentPosition = 0;
        var linePosition = 1;
        while (currentPosition < text.length) {
            var lineObject = readLine(text, currentPosition);
            if (!lineObject)
                break;
            currentPosition = lineObject.nextPosition;

            try {
                var splitted = splitByDelimiter(lineObject.line, delimiter);//lineObject.line.split(delimiter);
            }
            catch (e) {
                throw new Error("CSV Error: Line " + linePosition + ", " + (<Error>e).message);
            }
            for (var i = 1; i <= splitted.length; i++) {
                matrix.set([linePosition, i], splitted[i - 1]);
            }
            linePosition++;
        }
        return matrix;
    }
    function readLine(str: string, startIndex: number) {
        var firstcut = str.slice(startIndex);
        var found = firstcut.search(/[\r\n]/);
        if (found != -1) {
            var length = firstcut.slice(found).match(/[\r\n]+/)[0].length;
            return { line: firstcut.slice(0, found), nextPosition: startIndex + found + length };
        }
        else
            return { line: firstcut, nextPosition: str.length };
    }
    function splitByDelimiter(str: string, delimiter: string) {
        var isInQuote = false;
        var items: string[] = [];
        var item = "";
        var mayQuoteEnd = false;//just met a quotation mark in a quote

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
                }
                else if (isInQuote) {//already quoted
                    if (!mayQuoteEnd) {
                        mayQuoteEnd = true;
                        continue;
                    }
                    else
                        mayQuoteEnd = false;
                }
            }
            else if (mayQuoteEnd)
                throw new Error("column " + (i + 1) + ": quote is incorrectly ended.");

            item += char;
        }

        items.push(item);
        return items;
    }

    export function encode(matrix: Matrix<any>) {
        var result = "";
        var line = 1;
        if (matrix.dimension != 2)
            throw new Error("Matrix should be 2-dimensional to be saved as CSV.");
        matrix.forEach((item, coordinate) => {
            if (coordinate[0] != line) {
                result += "\r\n";
                line++;
            }
            else if (coordinate[1] != 1) {
                result += ',';
            }

            if (item === undefined)
                return;
            item = "" + item;
            if ((<string>item).match(/[,\"]/))
                result += escape(item);
            else
                result += item;
        });
        return result;
    }
    function escape(input: string) {
        return '"' + input.replace(/\"/g, '""') + '"';
    }
}