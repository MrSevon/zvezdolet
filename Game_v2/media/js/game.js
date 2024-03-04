(function () {
    let isPause = true
    let animationID = null;
    const speed = 3

 
    const score = document.querySelector('.score')
    const GameOver = document.querySelector('.game-over')
    const zvezdolet = document.querySelector('.zvezdolet')
    const zvezdoletInfo = {
        width: zvezdolet.clientWidth / 2,
        height: zvezdolet.clientHeight,
        coords: getCoords(zvezdolet),
        move: {
            left: null,
            right: null,
        },
    }
    console.dir(score)
    const meteorite = document.querySelector('.meteorite')
    const meteoriteInfo = {
        width: meteorite.clientWidth,
        height: meteorite.clientHeight,
        coords: getCoords(meteorite)
    }


    const button = document.querySelector('.btn')

    function timer() {
        let counter = 0;
        const intervalId = setInterval(() => {
            if (GameOver.style.display === 'initial') {
                console.log('Done');
                clearInterval(intervalId);
            }
            score.innerText = counter;
            counter += 1;

        }, 1000);
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // animationID = requestAnimationFrame(startGame);
    function startGame() {
        meteoriteAnimation();
        

        if (hasCollision()) {
            FinishGame()
            return
        }
        animationID = requestAnimationFrame(startGame); 
    }



    function scoreAnimation(time) {
        score.innerText(time);
    }

    function FinishGame() {
        isPause = !isPause;
        cancelAnimationFrame(animationID);
        cancelAnimationFrame(zvezdoletMoveToLeft);
        cancelAnimationFrame(zvezdoletMoveToRight);
        GameOver.style.display = 'initial';
    }
    
    document.addEventListener('keydown', (event) => {
        const code = event.code;
        if (!isPause) {
            if (code === 'ArrowLeft' && zvezdoletInfo.move.left === null) {
                zvezdoletInfo.move.left = requestAnimationFrame(zvezdoletMoveToLeft);
            }
            else if (code === 'ArrowRight' && zvezdoletInfo.move.right === null) {
                zvezdoletInfo.move.right = requestAnimationFrame(zvezdoletMoveToRight);
            }
        }
    });

    document.addEventListener('keyup', (event) => {
        const code = event.code

        if (code === 'ArrowLeft') {
            cancelAnimationFrame(zvezdoletInfo.move.left);
            zvezdoletInfo.move.left = null;
        }
        else if (code === 'ArrowRight') {
            cancelAnimationFrame(zvezdoletInfo.move.right);
            zvezdoletInfo.move.right = null;
        }
    });


    function zvezdoletMoveToLeft() {
        let newX = zvezdoletInfo.coords.x - 5;
        zvezdoletInfo.coords.x = newX;
        
        if (newX < -173 ) {
            return;
        }
        zvezdoletMove(newX, zvezdoletInfo.coords.y);
        zvezdoletInfo.move.left = requestAnimationFrame(zvezdoletMoveToLeft);
    }

    function zvezdoletMoveToRight() {
        let newX = zvezdoletInfo.coords.x + 5;
        zvezdoletInfo.coords.x = newX;

        if (newX > 173) {
            return;
        }
        zvezdoletMove(newX, zvezdoletInfo.coords.y);
        zvezdoletInfo.move.right = requestAnimationFrame(zvezdoletMoveToRight);
    }
    
    function zvezdoletMove(x, y) {
        zvezdolet.style.transform = `translate(${x}px, ${y}px)`;
    }

    function meteoriteAnimation() {
        let newYCoord = meteoriteInfo.coords.y + speed 
        let newXCoord = meteoriteInfo.coords.x

        if (newYCoord > 650) {
            newYCoord = 0;
            newXCoord = getRandomInt(-160,160)
        }
        meteoriteInfo.coords.x = newXCoord
        meteoriteInfo.coords.y = newYCoord;
        meteorite.style.transform = `translate(${newXCoord}px, ${newYCoord}px)` 
        
    }

    function hasCollision() {
        const zvezdoletYTop = zvezdoletInfo.coords.y
        const zvezdoletYBottom = zvezdoletInfo.coords.y + zvezdoletInfo.height;

        const meteoriteYTop = meteoriteInfo.coords.y;
        const meteoriteYBottom = meteoriteInfo.coords.y + meteoriteInfo.height;

        const zvezdoletXLeft = zvezdoletInfo.coords.x - zvezdoletInfo.width;
        const zvezdoletXRight = zvezdoletInfo.coords.x + zvezdoletInfo.width
        
        const meteoriteXLeft = meteoriteInfo.coords.x - meteoriteInfo.width;
        const meteoriteXRight = meteoriteInfo.coords.x + meteoriteInfo.width

        if (zvezdoletYTop > meteoriteYBottom) {
            return false;
        }


        if (zvezdoletXLeft > meteoriteXRight || zvezdoletXRight < meteoriteXLeft) {
            return false;
        }
        return true;
    }

    button.addEventListener('click', () => {
        isPause = !isPause
        if (isPause) {
            cancelAnimationFrame(animationID);
            cancelAnimationFrame(zvezdoletMoveToLeft)
            cancelAnimationFrame(zvezdoletMoveToRight)
            button.innerText = 'play';
        }
        else {
            timer()
            button.innerText = 'pause';
            animationID = requestAnimationFrame(startGame);
        }
    });

    function getCoords(element) {
        const matrix = window.getComputedStyle(element).transform;
        const array = matrix.split(',');
        const y = array[array.length - 1];
        const x = array[array.length - 2];
        const numericY = parseFloat(y);
        const numericX = parseFloat(x);

        return {x: numericX, y: numericY}
    }



})();