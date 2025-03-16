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
    
    let initiateTimer = () => {
        
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
        element.remove();
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
                initiateTimer();
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
        }
    }

    //backgroundAudio.play();
    //initiateTimer();
   
    //pixabay Sound


});