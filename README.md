# module that manipulate csv by using buffer  

## Installation
```
npm install
```

## Import
```js
import { getDataPointRowHeaderName, getDataPointRowColumn } from 'getdatafromcsvbuffer';
```

## Features
- Very fast CSV manipulation using Buffer
- Since Buffer operates outside the V8 heap, GC pauses are less likely to occur

---

## API

### getDataPointRowHeaderName(buffer, row, headerName)

Get data by specifying a header name and row number.

| Argument | Type | Description |
|---|---|---|
| buffer | Buffer | Buffer of the CSV file |
| row | number | Row number to retrieve (1-based, excluding header row) |
| headerName | string | Header name of the column to retrieve |

**Returns**: Buffer (matched data), or a negative number if not found

```js
import fs from 'node:fs';
const csv = fs.readFileSync('./data.csv');

// Get the "price" column of row 2
console.log(getDataPointRowHeaderName(csv, 2, 'price').toString());
```
