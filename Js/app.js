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
    let highScore = 0;
    let fxSound = true;
    let bgSound = true;

    let returnEmojis = returnEmoji();

    const clickableAudio = new Audio();
    clickableAudio.src = '../Assets/pop.mp3'

    const nonclickableAudio = new Audio();
    nonclickableAudio.src = '../Assets/chine.mp3'

    const backgroundAudio = new Audio();
    backgroundAudio.src = '../Assets/background.mp3';
    backgroundAudio.loop = true;

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
                if(fxSound) nonclickableAudio.play();
                updateLifeline();
                let mainScorePoint = document.querySelector('.mainScorePoint');
                clicked -= 1;
                mainScorePoint.innerText = String(clicked).padStart(2, '0');
                clickDestroyElement(element.id);
            });
        }else{
            element.addEventListener('click', ()=>{
                if(fxSound) clickableAudio.play();

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

                innerText = returnEmojis.next().value || '🤬';

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
                backgroundAudio.pause();
                if(fxSound) gameOverAudio.play();
                showModel('.gameOverMenu');
            }
        }
    }

    document.querySelector('.play').addEventListener('click', ()=>{
        ResetAll();
        hideModel('.mainMenuModel');
        if(bgSound) backgroundAudio.play();
        startCountDown()

        // if(bgSound) backgroundAudio.play();
        // if(fxSound) startAudio.play();
        // startGame();
    });

    document.querySelector('.setting').addEventListener('click', ()=>{
        document.querySelector('.menus1').style.transform = 'translateX(-100%)';
        document.querySelector('.menus2').style.transform = 'translateX(-100%)';
    });

    document.querySelectorAll('.back').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.menus1').style.transform = 'translateX(0%)';
            document.querySelector('.menus2').style.transform = 'translateX(0%)';
            document.querySelector('.menus3').style.transform = 'translateX(0%)';
        });
    });
    

    document.querySelector('.about').addEventListener('click', ()=>{
        document.querySelector('.menus1').style.transform = 'translateX(-100%)';
        document.querySelector('.menus3').style.transform = 'translateX(-200%)';
    });

    

    document.querySelector('.backtomenu').addEventListener('click', ()=>{
        ResetAll();
        showModel('.mainMenuModel');
        hideModel('.gameOverMenu');
    });

    document.querySelector('.restart').addEventListener('click', ()=>{
        ResetAll();
        if(bgSound) backgroundAudio.play();
        if(fxSound) startAudio.play();
        hideModel('.mainMenuModel');
        hideModel('.gameOverMenu');
        startGame();
    });

    document.getElementById('bgSoundId').addEventListener('change', function() {
        if (this.checked) {
            bgSound = false;
            // backgroundAudio.pause();
        } else {
            bgSound = true;
            // backgroundAudio.play();
        }
    });

    document.getElementById('fxSoundId').addEventListener('change', function() {
        if (this.checked) {
            fxSound = false;
        } else {
            fxSound = true;
        }
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

    function ResetAll(){
        timer = null;
        elementCount = 1;
        clicked = 0;
        speedUpConfig = {lastSpeenOn: 1, currentSpeed: 1, nextSpeedOn: 10};
        spawnRate = 1000;
        destroyRate = 2000;
        innerText = '😌';
        lifeLines = 3;
        nonclicableSpawn = 0.1;

        returnEmojis = returnEmoji();

        let scoreOpacityHigh = document.querySelector('.mainScorePoint');
        scoreOpacityHigh.classList.remove('scoreOpacityHigh');

        let linelineIcon = document.querySelectorAll('.lineline');
        linelineIcon.forEach((elem)=>{
            elem.innerText = '😇';
        })

        document.querySelector('.mainScorePoint').innerText = '00';

        document.querySelector('.menus1').style.transform = 'translateX(0%)';
        document.querySelector('.menus2').style.transform = 'translateX(0%)';
    }

    //backgroundAudio.play();
    //startGame();
   
    //pixabay Sound

    let startCountDown = () => {

        const messages = [
            "For the love of all things good, avoid the shit emoji. Your future self will thank you.",
            "Clicking the shit emoji is a choice... and not a good one. Choose wisely.",
            "Please, don’t click the shit. Your dignity is worth more than that.",
            "Pro tip: shit emoji : bad. Just don’t do it.",
            "Avoid the shit emoji like you avoid your ex’s texts. Trust me, it’s for the best.",
            "Don’t click the shit emoji... unless you’re into poor life choices."
        ];

        const randomIndex = Math.floor(Math.random() * messages.length);
        document.getElementById('randomTip').innerText = messages[randomIndex];

        showModel('.countDownPage');
        let countdownValue = 4;

        let intervalId = setInterval(() => {
            document.querySelector('.countNumber').innerText = countdownValue;
            countdownValue--;
    
            if (countdownValue < 0) {
                clearInterval(intervalId); 
                hideModel('.countDownPage');

                if(fxSound) startAudio.play();
                startGame();
            }
        }, 1000);
    };
    




});