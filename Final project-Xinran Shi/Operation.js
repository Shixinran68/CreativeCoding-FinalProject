// Utilities.js

//keys: c & n
//examples about how to use "KeyEvent": https://stackoverflow.com/questions/13552229/how-to-use-keyevent
function keyEvent(input, obj, func) {
    if (keyIsPressed)
        if (key === input)
            func(obj);
}