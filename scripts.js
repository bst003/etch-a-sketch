/*/////////////////////////////////////////
Global Variables
/////////////////////////////////////////*/

let currentGridSize = 16;
let currentColor = '#000000';
let currentFill = 'color';

const clearButton = document.querySelector('#clear');
const fillButtons = document.querySelectorAll('.fill-button');

const chosenColor = document.querySelector('#chosen-color');

const gridDimensionsDisplay = document.querySelector('#grid-dimensions-display');
const gridSizeInput = document.querySelector('#grid-size');

const easBoard = document.querySelector('#eas-board');



/*/////////////////////////////////////////
Functions
/////////////////////////////////////////*/


// Helper Functions
////////////////////

function removeGridBlockEnterListener() {

    gridBlocks.forEach( (gridBlock) => {

        gridBlock.removeEventListener('mouseenter', fillGridBlocks );

    });

}


function gridBlockListeners() {

    gridBlocks.forEach( (gridBlock) => {

        gridBlock.addEventListener('mousedown', fillGridBlocks );
    
        // Remove mousenter fillGridBlocks on mouseup
        gridBlock.addEventListener('mouseup', (e) => { 

            removeGridBlockEnterListener();

        } );

    });

}


function adjustGridSize() {

    // Update number of columns
    easBoard.style.gridTemplateColumns = `repeat(${currentGridSize}, 1fr)`;

    // Remove all existing child nodes
    easBoard.textContent = '';

    // Loop through currentGridSize squared to create grid-blocks
    for( let i = 0; i < currentGridSize * currentGridSize; i++ ){

        const gridBlock = document.createElement('div');
        gridBlock.classList.add('grid-block');

        easBoard.appendChild(gridBlock);

    }

}


function clearBoard() {

    gridBlocks.forEach( (gridBlock) => {
        gridBlock.style.backgroundColor = 'initial';
        gridBlock.style.opacity = 'initial';
    });

}


function fillGridBlocks( e ) {

    // If the event trigger was a mousedown add fillGridBlocks on mouseenter
    if( e.type === 'mousedown' ){

        e.preventDefault();

        currentMouseDownStatus = true;

        gridBlocks.forEach( (gridBlock) => {

            gridBlock.addEventListener('mouseenter', fillGridBlocks );
    
        });

    }

    // Update background-color of target block based on currentFill
    switch ( currentFill ) {

        case 'color':
            e.target.style.backgroundColor = `${currentColor}`;
            if ( !e.target.style.opacity ||  e.target.style.opacity === 'initial' ) {

                e.target.style.opacity = '.2';

            } else if ( e.target.style.opacity <= 1 ) {

                let currentOpacity = e.target.style.opacity;
                let newOpacity = Number(currentOpacity) + .2;

                e.target.style.opacity = `${newOpacity}`;

            }

            break;

        case 'rainbow':
            const rgbValues = generateRainbowColors();
            e.target.style.backgroundColor = `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
            e.target.style.opacity = 'initial';
            break;

        case 'eraser':
            e.target.style.backgroundColor = `initial`;
            e.target.style.opacity = 'initial';

    } 

}


function generateRainbowColors() {

    const rainbowArray = [];

    for ( let i = 0; i < 3; i++ ){

        const numberValue = Math.round( Math.random() * 255 );
        rainbowArray.push(numberValue);

    }

    return rainbowArray;

}


// Main Functions
////////////////////


function updateCurrentFill( e ) {

    // Update current fill
    currentFill = e.target.getAttribute('data-fill');


    fillButtons.forEach( (fillButton) => {

        fillButton.classList.remove('active');
    
    });


    e.target.classList.add('active');

}


function updateCurrentColor( e ) {

    currentColor = e.target.value;
    console.log( currentColor );

}


function updateGridDimensionsDisplay( e ){

    let sizeInputValue = e.target.value;

    gridDimensionsDisplay.innerText = `${sizeInputValue} x ${sizeInputValue}`;

}


function updateBoardGridSize( e ) {

    let sizeInputValue = e.target.value;

    // Update currentGridSize global variable and call adjustGridSize again;
    currentGridSize = sizeInputValue;

    // Clear the board
    clearBoard();

    adjustGridSize();

    // Redeclare gridBlocks and listeners
    gridBlocks = document.querySelectorAll('.grid-block');

    gridBlockListeners();

}



/*/////////////////////////////////////////
Setup and Interaction
/////////////////////////////////////////*/

// Call function to create grid 
adjustGridSize();

// Must be declared after they're created
let gridBlocks = document.querySelectorAll('.grid-block');

// Update #grid-dimensions-display on change and mousemove
gridSizeInput.addEventListener('change', updateGridDimensionsDisplay );
gridSizeInput.addEventListener('mousemove', updateGridDimensionsDisplay );

// Only update actual grid items on change
gridSizeInput.addEventListener('change', updateBoardGridSize );

clearButton.addEventListener('click', clearBoard );

// Update currentColor
chosenColor.addEventListener('change', updateCurrentColor );

// Set up base grid block listeners
gridBlockListeners();

fillButtons.forEach( (fillButton) => {

    fillButton.addEventListener('click', updateCurrentFill );

});

// Remove mouseneter grid block listener if user mouses out of the board
easBoard.addEventListener('mouseleave', removeGridBlockEnterListener );