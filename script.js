document.querySelector(".control-buttons span").onclick = function() {
    let yourName = prompt("Whats your name? ");

    if (yourName == null || yourName == "") {

        document.querySelector(".name span").innerHTML = 'Guest';
    } else {
        document.querySelector(".name span").innerHTML = yourName;
    }

    document.querySelector(".control-buttons").remove();
};


let duration = 1000; //ms

let blocksContainer = document.querySelector(".memory-game-blocks");

//create array from game blocks 
let blocks = Array.from(blocksContainer.children);


let orderRange = [...Array(blocks.length).keys()];


console.log(orderRange);
shuffle(orderRange);
console.log(orderRange);
 
blocks.forEach((block, index) => {

    block.style.order = orderRange[index];

    block.addEventListener('click', function() {
        flipBlock(block);
    })

});


function flipBlock(selectedBlock) {

    selectedBlock.classList.add('is-flipped');

    let allflipped = blocks.filter(flipped => flipped.classList.contains('is-flipped'));
   
    if(allflipped.length === 2) {
        //stop flip function
        stopClicking();
        //check match function
        checkMatch(allflipped[0], allflipped[1]);
    }
   

}


//function to stop clicking
function stopClicking() {

    blocksContainer.classList.add('no-clicking');
    //end the stopClicking function after ${duration} time

    setTimeout(() => {
        blocksContainer.classList.remove('no-clicking');
    }, duration);
}

//function to check if the two blocks matches

function checkMatch(firstBlock, secondBlock) {

    let tries_element = document.querySelector('.tries span');
    if(firstBlock.dataset.pattern === secondBlock.dataset.pattern) {
        firstBlock.classList.remove('is-flipped');
        secondBlock.classList.remove('is-flipped');
        
        firstBlock.classList.add('has-match');
        secondBlock.classList.add('has-match');
    } else {
        tries_element.innerHTML = parseInt(tries_element.innerHTML) +1;
        setTimeout(() => {
            firstBlock.classList.remove('is-flipped');
            secondBlock.classList.remove('is-flipped');
        }, duration);
       
    }

}



//the shuffle function to make a random order for the cards 

function shuffle (array) {

    let current = array.length, temp, random;

    while( current > 0) {
        random = Math.floor(Math.random() * current);
        current--;

        temp = array[current];
        array[current] = array[random];
        array[random] = temp;
    }
    return array;
}