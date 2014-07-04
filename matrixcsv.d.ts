declare module CSV {
    function readFile(file: Blob, onload: (matrix: Matrix<string>) => any, delimiter?: string): void;
    function decode(text: string, delimiter?: string): Matrix<string>;
    function encode(matrix: Matrix<any>): string;
}
