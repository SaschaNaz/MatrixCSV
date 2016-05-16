/// <reference path="../submodules/mathextension/mathextension.d.ts" />
/// <reference path="../lib/matrixcsv.d.ts" />
declare var loader: HTMLInputElement;
var data: Matrix<any>;
document.addEventListener("DOMContentLoaded", () => {
    loader.addEventListener("change", async () => {
        data = await MatrixCSV.readFile(loader.files[0]);
        alert("File is loaded.");
    })
});