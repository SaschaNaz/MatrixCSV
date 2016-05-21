declare namespace MatrixCSV {
    import Matrix = SNMath.Matrix;
    function readFile(file: Blob, delimiter?: string): Promise<Matrix<string>>;
    function decode(text: string, delimiter?: string): Matrix<string>;
    function encode(matrix: Matrix<any>): string;
}
