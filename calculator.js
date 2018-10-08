document.addEventListener("DOMContentLoaded", function() {

    // define shortcuts for selectors
    const $QSA = (elem) => document.querySelectorAll(elem),
          $ID = (elem) => document.getElementById(elem);

    // define variables
    let input = [],
        result,
        evalResult;

    // sanitize input
    const sanitizeInput = () => {
        result = input.reduce((a, b) => a + b); // reduce input of array to string
        result.replace(/[^-()\d/*+.]/g, ""); // sanitize user input string from anything that is not mathematical
        $ID("resultSmall").innerHTML = $ID("result").innerHTML = result; // display result
    };

    // add click event listener to all buttons that are either number or operator
    const getInput = function(key) {
        event.type === 'keydown'
        ? input.push(key)
        : input.push(this.getAttribute("data-value")); // data-value equals number or operator value
        sanitizeInput();
    }
    Array.from($QSA("button.calc")).forEach(item => item.addEventListener("click", getInput));

    // click on "equal sign" reduce input array to string and evals it
    const calculate = () => {
        if(input.length == 0) {
            result = 0;
        }
        evalResult = eval(result);
        /* ATTENTION: only sanitized user input gets evaled. Make sure to keep regex in getInput.
        Don't use eval for server-side operation. Only use eval for client-side operation */
        $ID("resultSmall").innerHTML = result + " = " + evalResult;
        $ID("result").innerHTML = evalResult;
    }
    $ID("calculate").addEventListener("click", calculate);

    // clear last entry
    const clearLastEntry = () => {
        input.pop();
        input.length >= 1 ? sanitizeInput() : $ID("resultSmall").innerHTML = $ID("result").innerHTML = 0
    }
    $ID("clearentry").addEventListener("click", clearLastEntry);

    // clear all entry
    const clearAllEntry = () => {
        input = [];
        $ID("resultSmall").innerHTML = $ID("result").innerHTML = 0;
    }
    $ID("allclear").addEventListener("click", clearAllEntry);

    // highlight button on keypress
    const highlightButton = (btnData) => {
        let res = Array.from($QSA('button')).filter(btn => {
            return btn.getAttribute('data-value') === btnData;
        });

        if(res.length > 0) {
            res = res[0];
            res.classList.add('keypressed');

            setTimeout(() => {
                res.classList.remove('keypressed');
            }, 300);
        }
    }

    // keystroke events via keyypress.js https://dmauro.github.io/Keypress/
    (function init_keypress() {
        document.body.onkeydown = event => {
            const key_number = /\d/g;
            const key_operator = /(\+|-|\*|\/)/g;
            const key_calculate = "Enter";
            const key_clearEntry = "Backspace";
            const key_clearAllEntry = "Delete";
            let key = event.key.toString();

            if(key_number.test(key)) {
                getInput(key);
            }
            else if (key_operator.test(key)) {
                getInput(key);
            }
            else if (key_calculate === key) {
                calculate();
            }
            else if (key_clearEntry === key) {
                clearLastEntry();
            }
            else if (key_clearAllEntry === key) {
                clearAllEntry();
            }

            highlightButton(key);
        }

    })();

});
