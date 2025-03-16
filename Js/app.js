document.addEventListener('DOMContentLoaded', ()=>{
    let timer;
    let elementCount = 1;
    let clicked = 0;
    let speedUpConfig = {lastSpeenOn: 1, currentSpeed: 1, nextSpeedOn: 10};
    let spawnRate = 1000;
    let destroyRate = 2000;
    let innerText = '😌';
    let lifeLines = 3;
    let nonclicableSpawn = 0.1;

    const returnEmojis = returnEmoji();

    const clickableAudio = new Audio();
    clickableAudio.src = '../Assets/pop.mp3'

    const nonclickableAudio = new Audio();
    nonclickableAudio.src = '../Assets/chine.mp3'

    const backgroundAudio = new Audio();
    backgroundAudio.src = '../Assets/background.mp3';

    const startAudio = new Audio();
    startAudio.src = '../Assets/gameStart.mp3';

    const gameOverAudio = new Audio();
    gameOverAudio.src = '../Assets/gameOver.mp3';


    
    let startGame = () => {
        
        if (!timer) {
            timer = setInterval(() => {
                const top = Math.floor(Math.random() * (70 - 30 + 1)) + 30;
                const left = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
                const elementId = `elementsNo${elementCount}`;

                speedUp();

                createElements(elementId, top, left);
                selfDestroyElement(elementId, destroyRate);


                elementCount += 1

            }, spawnRate);
    
        }
    }

    let createElements = (id, top, left)=>{
        let pTag = document.createElement('p');
        pTag.innerText = innerText;

        let element = document.createElement('div');

        let isNonClickable =randomNonClickable();
        if(isNonClickable){
            pTag.innerText = '💩';
            element.classList.add('elements', 'nonclickable');
        }else{
            element.classList.add('elements', 'clickable');
        }
        element.id = id;
        element.style.top = `${top}%`;
        element.style.left = `${left}%`;

        element.appendChild(pTag);
        
        if(isNonClickable){
            element.addEventListener('click', ()=>{
                nonclickableAudio.play();
                updateLifeline();
                let mainScorePoint = document.querySelector('.mainScorePoint');
                clicked -= 1;
                mainScorePoint.innerText = String(clicked).padStart(2, '0');
                clickDestroyElement(element.id);
            });
        }else{
            element.addEventListener('click', ()=>{
                clickableAudio.play();

                let mainScorePoint = document.querySelector('.mainScorePoint');
                clicked += 1;
                mainScorePoint.innerText = String(clicked).padStart(2, '0');
                clickDestroyElement(element.id);
            });
        }

        

        let elementContainer = document.querySelector('.elementContainer');
        elementContainer.appendChild(element);

        function randomNonClickable() {
            let random = Math.random();
            if (random < nonclicableSpawn) {
              return true;
            } else {
              return false;
            }
        }
    }

    let selfDestroyElement = (id, timer)=>{
        var element = document.getElementById(id);
        setTimeout(function() {
            element.remove();
        }, timer);
    }

    let clickDestroyElement = (id)=>{
        var element = document.getElementById(id);
        element?.remove();
    }

    let speedUp = ()=>{
        speedUpConfig.currentSpeed += 1;
        if(speedUpConfig.currentSpeed == speedUpConfig.nextSpeedOn){
            speedUpConfig.lastSpeenOn = speedUpConfig.currentSpeed;
            speedUpConfig.nextSpeedOn += 10;

            if(spawnRate > 400){
                spawnRate -=100;
                destroyRate = spawnRate*2;

                innerText = returnEmojis.next().value

                clearInterval(timer);
                timer = null;
                startGame();
                if(nonclicableSpawn < 0.5){
                    nonclicableSpawn += 0.1
                }
            }
        }

    }

    function* returnEmoji() {
        yield '😁';
        yield '😐';
        yield '😯';
        yield '😨';
        yield '😱';
        return '🤬';
    }

    let updateLifeline = ()=>{
        if(lifeLines > 0){
            let linelinesDiv = document.getElementById(`lineline${lifeLines}`);
            linelinesDiv.innerText = '☠️';

            lifeLines -= 1;

            if(lifeLines == 0){
                gameOverHere();
                gameOverAudio.play();
                showModel('.gameOverMenu');
            }
        }
    }

    document.querySelector('.play').addEventListener('click', ()=>{
        startAudio.play();
        hideModel('.mainMenuModel');
        startGame();
    });

    document.querySelector('.backtomenu').addEventListener('click', ()=>{
        showModel('.mainMenuModel');
        hideModel('.gameOverMenu');
    });

    document.querySelector('.restart').addEventListener('click', ()=>{
        startAudio.play();
        hideModel('.mainMenuModel');
        hideModel('.gameOverMenu');
        startGame();
    });

    let showModel = (clsName)=>{
        let model = document.querySelector(clsName);
        model.classList.add('showModel');
        model.classList.remove('hideModel');
    }

    let hideModel = (clsName)=>{
        let model = document.querySelector(clsName);
        model.classList.add('hideModel');
        model.classList.remove('showModel');
    }

    let gameOverHere = ()=>{
        clearInterval(timer);

        let elementContainer = document.querySelector('.elementContainer');
        elementContainer.innerHTML = '';

        let scoreOpacityHigh = document.querySelector('.mainScorePoint');
        scoreOpacityHigh.classList.add('scoreOpacityHigh');
    }

    //backgroundAudio.play();
    //startGame();
   
    //pixabay Sound


});