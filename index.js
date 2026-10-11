const crlf = Buffer.from([0x0d, 0x0a]);

//get data from buffer by pointing row and header name
function getDataPointRowHeaderName(buffer, row, headerName) {
    let crlfCount2 = 0;
    let lengthCount2 = 0;
    let crlfPosition2 = -2;

    //get column number of header pointed by parameter
    const columnPosition = buffer.indexOf(headerName, 0, buffer.indexOf(crlf));
    let column = 0;
    let columnTempIndex = -1;
    while (columnTempIndex < columnPosition) {
        if (buffer.indexOf(0x2c, columnTempIndex + 1) === -1) {
            break;
        } else {
            column += 1;
            let temp = columnTempIndex;
            columnTempIndex = buffer.indexOf(0x2c, temp + 1);
        }
    };


    //find the position of row(crlfposition2 + 2) pointed by parameter
    while (crlfCount2 != row) {
        let crlfTemp = buffer.indexOf(crlf, crlfPosition2 + 2);
        if (crlfTemp === -1) {
            return -3;
        } else {
            crlfCount2 += 1;
            crlfPosition2 = crlfTemp;
            lengthCount2 = crlfTemp;
        };
    };

    //find the position of column pointed by parameter in the row detected above
    let commaCount = 0;
    let commaTempPosition = buffer.indexOf(0x2c, crlfPosition2 + 2);
    let temp = crlfPosition2;
    if (commaCount === column - 1) {
        commaTempPosition = crlfPosition2 + 1;
    } else {
        while (commaCount != column - 1) {
            if (commaTempPosition === -1) {
                return -2;
            } else {
                commaCount += 1;
                commaTempPosition = buffer.indexOf(0x2c, temp + 2);
                temp = commaTempPosition;
            };
        };
    };


    //get the data between commaTempPosition and next nextCommaPosition(or nextCrlfPosition)
    const nextCommaPosition = buffer.indexOf(0x2c, commaTempPosition + 1);
    const nextCrlfPosition = buffer.indexOf(crlf, commaTempPosition + 1);

    if (nextCrlfPosition === -1) {
        if (nextCommaPosition === -1) {
            return buffer.slice(commaTempPosition + 1);
        };

        if (commaTempPosition < buffer.lastIndexOf(buffer[buffer.length - 1])) {
            return buffer.slice(commaTempPosition + 1, nextCommaPosition);
        } else {
            return buffer.slice(commaTempPosition + 1);
        };
    } else {
        if (nextCommaPosition === -1) {
            return buffer.slice(commaTempPosition + 1, nextCrlfPosition);
        } else {
            if (nextCommaPosition < nextCrlfPosition) {
                return buffer.slice(commaTempPosition + 1, nextCommaPosition);
            } else {
                return buffer.slice(commaTempPosition + 1, nextCrlfPosition);
            };

        }
    };

}

export { getDataPointRowHeaderName };
