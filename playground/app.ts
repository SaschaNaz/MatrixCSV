/// <reference path="../submodules/snmath/lib/snmath.d.ts" />
/// <reference path="../lib/matrixcsv.d.ts" />
declare var loader: HTMLInputElement;
var data: SNMath.Matrix<any>;
document.addEventListener("DOMContentLoaded", () => {
    loader.addEventListener("change", async () => {
        data = await MatrixCSV.readFile(loader.files[0]);
        alert("File is loaded.");
    })
});