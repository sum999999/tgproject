var IDENT = '购彩平台';

var LOG_LEVELS = {
    debug: 0,
    log: 1,
    table: 1,
    warn: 2,
    error: 3,
    silent: 4
};

/*
  @see WorkBox
*/
// Safari doesn't print all console.groupCollapsed() arguments.
// Related bug: https://bugs.webkit.org/show_bug.cgi?id=182754
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

const GREY = `#7f8c8d`;
const GREEN = `#2ecc71`;
const YELLOW = `#f39c12`;
const RED = `#c0392b`;
const BLUE = `#3498db`;
const BLANK = '#000000';

const getDefaultLogLevel = () => LOG_LEVELS.debug;

let logLevel = getDefaultLogLevel();
const shouldPrint = minLevel => logLevel <= minLevel;

// We always want groups to be logged unless logLevel is silent.
const groupLevel = LOG_LEVELS.error;

const _print = function (keyName, logArgs, levelColor, ident) {
    const logLevel = keyName.indexOf('group') === 0 ? groupLevel : LOG_LEVELS[keyName];
    if (!shouldPrint(logLevel)) {
        return;
    }

    if (!levelColor || keyName === 'groupCollapsed' && isSafari) {
        console[keyName](...logArgs);
        return;
    }

    if (ident) {
        const prefix = logArgs.shift();
        const logPrefix = [`%c${prefix}`, `background: ${levelColor}; color: white; padding: 2px 0.5em; border-radius: 0.5em;`];
        console['log'](...logPrefix, ...logArgs);
        return;
    }

    const logPrefix = [`%c${IDENT}`, `background: ${levelColor}; color: white; padding: 2px 0.5em; border-radius: 0.5em;`];
    console[keyName](...logPrefix, ...logArgs);
};

const groupEnd = () => {
    if (shouldPrint(groupLevel)) {
        console.groupEnd();
    }
};

const defaultExport = {
    groupEnd,
    prefixed: {
        groupEnd
    },
    unprefixed: {
        groupEnd
    }
};

const setupLogs = (keyName, color) => {
    defaultExport[keyName] = (...args) => _print(keyName, args, color);
    defaultExport.prefixed[keyName] = (...args) => _print(keyName, args, color, true);
    defaultExport.unprefixed[keyName] = (...args) => _print(keyName, args);
};

const levelToColor = {
    debug: GREY,
    log: GREEN,
    table: GREEN,
    warn: YELLOW,
    error: RED,
    groupCollapsed: BLUE,
    group: BLANK
};

Object.keys(levelToColor).forEach(keyName => setupLogs(keyName, levelToColor[keyName]));

export default defaultExport;
