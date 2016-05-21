MatrixCSV
=========

JavaScript CSV tool based on [SNMath.Matrix](https://github.com/SaschaNaz/SNMath)

### API

```typescript
declare module MatrixCSV { 
  function readFile(file: Blob, delimiter?: string): Promise<Matrix<string>>;
  function decode(text: string, delimiter?: string): Matrix<string>; 
  function encode(matrix: Matrix<any>): string; 
}
```
