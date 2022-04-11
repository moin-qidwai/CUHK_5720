var error = 0;
const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

if (!!(process.argv) && process.argv.length > 1) {
    const text = ReverseString(process.argv[2]);

    for (var i = 0; i < text.length; i++) {
        const t = alphabets[Math.ceil((i%(3*26)+1)/3)-1];
        if (t !== text[i]) {
            error++;
        }
    }
    
    const result = (1 - error/text.length)*100;
    console.log(result);
}

function ReverseString(str) {
    return str.split('').reverse().join('')
}