//get data from buffer by pointing row and column
function getDatapointRowColumn(buffer, row, column, header) {
    let crlfCount = 0;
    let lengthCount = 0;
    let crlfPosition = -2;
    let lengthBetweenCrlfCount = 0;

    if (header === true) {
        const crlf = Buffer.from([0x0d, 0x0a]);
        //find the row pointed by parameter
        while (lengthCount < buffer.length) {
            let crlfTemp = buffer.indexOf(crlf, crlfPosition + 2);
            if (crlfTemp === -1) {
                return -1;
            } else {
                crlfCount += 1;
                crlfPosition = crlfTemp;
                lengthCount = crlfTemp;
            }
            if (crlfCount) {
                const lengthBetweenCrlf = buffer
                    .slice(crlfPosition + 2, buffer.indexOf(crlf, crlfPosition + 2))
                    .length;
                let commaCount = 0;
                let commaTempPosition = buffer.indexOf(0x2c, crlfPosition + 2);
                while (lengthBetweenCrlfCount < lengthBetweenCrlf) {

                    if (commaTempPosition === -1) {
                        return -2;
                    } else {
                        commaCount += 1;
                        lengthBetweenCrlfCount += commaTempPosition - (crlfPosition + 2);
                    };

                    if (commaCount === column - 1) {
                        const nextCommaPosition = buffer.indexOf(0x2c, commaTempPosition + 1);
                        const nextCrlfPosition = buffer.indexOf(crlf, commaTempPosition + 1);
                        if (nextCommaPosition <= nextCrlfPosition) {
                            return buffer.slice(commaTempPosition + 1, nextCommaPosition);
                        } else {
                            return buffer.slice(commaTempPosition + 1, nextCrlfPosition);
                        }
                    } else {
                        commaTempPosition = buffer.indexOf(0x2c, commaTempPosition + 1);
                    }
                };
            }
        }
    } else if (header === false || header === null || header === undefined) {
        const crlf = Buffer.from([0x0d, 0x0a]);
        //find the row pointed by parameter
        while (lengthCount < buffer.length) {
            let crlfTemp = buffer.indexOf(crlf, crlfPosition + 2);
            if (crlfTemp === -1) {
                return -1;
            } else {
                crlfCount += 1;
                crlfPosition = crlfTemp;
                lengthCount = crlfTemp;
            }
            if (crlfCount === row - 1) {
                const lengthBetweenCrlf = buffer
                    .slice(crlfPosition + 2, buffer.indexOf(crlf, crlfPosition + 2))
                    .length;
                let commaCount = 0;
                let commaTempPosition = buffer.indexOf(0x2c, crlfPosition + 2);
                while (lengthBetweenCrlfCount < lengthBetweenCrlf) {

                    if (commaTempPosition === -1) {
                        return -1;
                    } else {
                        commaCount += 1;
                        lengthBetweenCrlfCount += commaTempPosition - (crlfPosition + 2);
                    };

                    if (commaCount === column - 1) {
                        const nextCommaPosition = buffer.indexOf(0x2c, commaTempPosition + 1);
                        const nextCrlfPosition = buffer.indexOf(crlf, commaTempPosition + 1);
                        if (nextCommaPosition <= nextCrlfPosition) {
                            return buffer.slice(commaTempPosition + 1, nextCommaPosition);
                        } else {
                            return buffer.slice(commaTempPosition + 1, nextCrlfPosition);
                        }
                    } else {
                        commaTempPosition = buffer.indexOf(0x2c, commaTempPosition + 1);
                    }
                };
            }
        }

    } else {
        console.log("not appropriate 4th parameter")
        return -1;
    }

}