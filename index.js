const crlf = Buffer.from([0x0d, 0x0a]);

//get data from buffer by pointing row and column
function getDataPointRowColumn(buffer, row, column, header) {
    let crlfCount = 0;
    let lengthCount = 0;
    let crlfPosition = -2;
    let lengthBetweenCrlfCount = 0;
    const allCrlfCount = getCrlfAllCount(buffer);
    const lastRowNumber = getLastRowNumber(buffer);

    if (header === true) {
        //find the row pointed by parameter
        while (lengthCount < buffer.length) {
            let crlfTemp = buffer.indexOf(crlf, crlfPosition + 2);
            if (crlfTemp === -1) {
                return -1;
            } else {
                crlfCount += 1;
                crlfPosition = crlfTemp;
                lengthCount = crlfTemp;

            };
            if (crlfCount === row) {

                let lengthBetweenCrlf;
                if (crlfCount < allCrlfCount) {
                    lengthBetweenCrlf = buffer
                        .slice(crlfPosition + 2, buffer.indexOf(crlf, crlfPosition + 2))
                        .length;
                } else {
                    lengthBetweenCrlf = buffer
                        .slice(crlfPosition + 2, buffer.length)
                        .length;
                };

                let commaCount = 0;
                let nowPosition = crlfPosition;
                let nextCommaPosition = buffer.indexOf(0x2c, crlfPosition + 2);
                let nextCrlfPosition = buffer.indexOf(crlf, crlfPosition + 2);

                while (lengthBetweenCrlfCount <= lengthBetweenCrlf) {

                    if (commaCount === column - 1) {
                        if (nextCrlfPosition === -1) {
                            if (nextCommaPosition === -1) {
                                return buffer.slice(nowPosition + 2);
                            } else {
                                return buffer.slice(nowPosition + 2, nextCommaPosition);
                            };
                        } else {
                            if (nextCommaPosition === -1) {
                                return buffer.slice(nowPosition + 2, nextCrlfPosition);
                            } else {
                                if (nextCommaPosition < nextCrlfPosition) {
                                    return buffer.slice(nowPosition + 2, nextCommaPosition);
                                } else {
                                    return buffer.slice(nowPosition + 2, nextCrlfPosition);
                                }
                            };
                        };
                    };

                    nowPosition = buffer.indexOf(0x2c, nowPosition + 2);

                    nextCommaPosition = buffer.indexOf(0x2c, nowPosition + 2);
                    nextCrlfPosition = buffer.indexOf(crlf, nowPosition + 2);


                    if (crlfCount < lastRowNumber) {
                        if (nextCommaPosition === -1) {
                            return -2;
                        } else {
                            commaCount += 1;
                            if (nextCommaPosition < nextCrlfPosition) {
                                lengthBetweenCrlfCount = nextCommaPosition - (crlfPosition + 2);
                            } else {
                                lengthBetweenCrlfCount = nextCrlfPosition - (crlfPosition + 2);
                            };
                        };
                    } else {
                        if (nextCommaPosition === -1) {
                            if (nextCrlfPosition == -1) {
                                commaCount += 1;
                                lengthBetweenCrlfCount = buffer.length - (crlfPosition + 2);
                            } else {
                                commaCount += 1;
                                lengthBetweenCrlfCount = nextCrlfPosition - (crlfPosition + 2);
                            };
                        } else {
                            commaCount += 1;
                            lengthBetweenCrlfCount = nextCommaPosition - (crlfPosition + 2);
                        };
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
            };
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
        return -1;
    }

}

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

function getCrlfAllCount(buffer) {
    let offset = 0;
    let count = 0;
    while (true) {
        if (buffer.indexOf(crlf, offset) === -1) {
            break;
        } else {
            count++;
            offset = buffer.indexOf(crlf, offset) + 2;
        };
    };
    return count;
};

function getLastRowNumber(buffer) {
    let offset = 0;
    let count = 0;
    while (true) {
        if (buffer.indexOf(crlf, offset) === -1) {
            break;
        } else {
            if (buffer.slice(buffer.indexOf(crlf, offset) + 2, buffer.indexOf(crlf, offset) + 4).equals(Buffer.from([0x0d, 0x0a]))) {
                break;
            }
            count++;
            offset = buffer.indexOf(crlf, offset) + 2;
        };
    };
    return count;
};

export { getDataPointRowColumn, getDataPointRowHeaderName };
